import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {RsaEncryption} from "../encryption/RsaEncryption";
import {ErrorHandlingService} from "./error-handling.service";
import {UserService} from "./user.service";
import {EncodingService} from "./encoding.service";
import {ChaCha20EncryptionService} from "./cha-cha20-encryption.service";
import {count} from "rxjs/operators";
import {AuthenticationService} from "./authentication.service";

@Injectable({providedIn: 'root'})
export class RsaEncryptionService {
  private publicKeyHeader: string = '-----BEGIN PUBLIC KEY-----';
  private publicKeyFooter: string = '-----END PUBLIC KEY-----';
  private privateKeyHeader: string = '-----BEGIN PRIVATE KEY-----';
  private privateKeyFooter: string = '-----END PRIVATE KEY-----';

  private keys: CryptoKeyPair;
  private nonce: Uint8Array;
  private counter: Uint8Array;

  constructor(private httpClient: HttpClient,
              private router: Router,
              private errorHandler: ErrorHandlingService,
              private userService: UserService,
              private encoding: EncodingService,
              private chacha: ChaCha20EncryptionService) {
  }

  public decryptKeys(passphrase: any) {
    return this.importRsaKeys(this.userService.getUserInfo(), passphrase);
  }

  public publicEncrypt(data: string): Promise<any> {
    return RsaEncryption.publicEncrypt(this.encoding.convertStringToArrayBuffer(data), this.keys.publicKey)
      .then(res => this.encoding.convertArrayBufferToString(res))
      .catch(err => {
        throw this.errorHandler.handleEncryptionError('Error during public encryption', err)
      });
  }

  public privateDecrypt(data: string): Promise<any> {
    return RsaEncryption.privateDecrypt(this.encoding.convertStringToArrayBuffer(data), this.keys.privateKey)
      .then(res => this.encoding.convertArrayBufferToString(res))
      .catch(err => {
        throw this.errorHandler.handleEncryptionError('Error during private decryption', err)
      });
  }

  private async importRsaKeys(response: any, passphrase: string) {
    const symmKey = await RsaEncryptionService.generateHash(response.username, passphrase);
    console.log(new Uint8Array(symmKey))
    const unwrappedPublicKey = this.unwrapPublicKey(response.publicKey);
    const unwrappedPrivateKey = this.unwrapPrivateKey(response.encryptedPrivateKey);

    console.log('import before decryption')
    console.log(new Uint8Array(unwrappedPrivateKey))
    const decryptedPrivateKey = this.chacha.update(new Uint8Array(symmKey), this.nonce, this.counter, new Uint8Array(unwrappedPrivateKey));
    console.log(decryptedPrivateKey);
    console.log(window.btoa(String.fromCharCode.apply(null, decryptedPrivateKey)))
    const publicKey = await window.crypto.subtle.importKey(
      "spki",
      unwrappedPublicKey,
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      true,
      ["encrypt"]
    );

    const privateKey = await window.crypto.subtle.importKey(
      "pkcs8",
      decryptedPrivateKey,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ["decrypt"]
    );

    console.log('debug');
    this.keys = {publicKey, privateKey};
  }

  encryptKey(keyPassphrase: any, publicKey: any) {
    return RsaEncryption.importPublicKey(publicKey)
      .then(key => {
        return RsaEncryption.publicEncrypt(this.encoding.convertStringToArrayBuffer(keyPassphrase), key)
          .then(res => this.encoding.convertArrayBufferToString(res));
      });
  }

  public async exportKeys(keys: CryptoKeyPair, chachaKey: ArrayBuffer, nonce: Uint8Array, counter: Uint8Array) {
    let publicKeyExport = await window.crypto.subtle.exportKey(
      "spki",
      keys.publicKey,
    );

    let privateKeyExport = await window.crypto.subtle.exportKey(
      "pkcs8",
      keys.privateKey,
    );

    console.log('nonce before', nonce)
    console.log('counter before', counter)
    console.log('key before', new Uint8Array(chachaKey))

    console.log('private key before encryption')
    console.log(new Uint8Array(privateKeyExport))
    console.log(window.btoa(String.fromCharCode.apply(null, new Uint8Array(privateKeyExport))))

    const encryptedPrivateKey = this.chacha.update(new Uint8Array(chachaKey), nonce, counter, new Uint8Array(privateKeyExport))
    console.log('private key after encryption')
    console.log(encryptedPrivateKey);

    console.log(window.btoa(String.fromCharCode.apply(null, encryptedPrivateKey)))

    const publicKeyPem = this.wrapPublicKey(publicKeyExport);
    const privateKeyPem = this.wrapPrivateKey(encryptedPrivateKey, nonce, counter);

    return {
      publicKey: publicKeyPem,
      privateKey: privateKeyPem
    };
  }

  private wrapPublicKey(publicKey: ArrayBuffer): string {
    const publicKeyBase64 = window.btoa(String.fromCharCode.apply(null, new Uint8Array(publicKey)));
    return `${this.publicKeyHeader}\n${publicKeyBase64}\n${this.publicKeyFooter}`;
  }

  private wrapPrivateKey(privateKey: Uint8Array, nonce: Uint8Array, counter: Uint8Array): string {
    const privateKeyBase64 = window.btoa(String.fromCharCode.apply(null, privateKey));
    const nonceBase64 = window.btoa(String.fromCharCode.apply(null, nonce));
    const counterBase64 = window.btoa(String.fromCharCode.apply(null, counter));
    return `${this.privateKeyHeader}\n${privateKeyBase64}${nonceBase64}${counterBase64}\n${this.privateKeyFooter}`;
  }

  private unwrapPublicKey(publicKey) {
    const pemKey = publicKey.substring(this.publicKeyHeader.length, publicKey.length - this.publicKeyFooter.length);
    const stringKey = window.atob(pemKey);
    return this.encoding.convertStringToArrayBuffer(stringKey);
  }

  private unwrapPrivateKey(wrappedPrivateKey) {
    const counterBase64 = wrappedPrivateKey.substring(wrappedPrivateKey.length - this.privateKeyFooter.length - 13, wrappedPrivateKey.length - this.publicKeyFooter.length - 1);
    this.counter = new Uint8Array(this.encoding.convertStringToArrayBuffer(window.atob(counterBase64)));

    const nonceBase64 = wrappedPrivateKey.substring(wrappedPrivateKey.length - this.privateKeyFooter.length - 25, wrappedPrivateKey.length - this.publicKeyFooter.length - 14);
    this.nonce = new Uint8Array(this.encoding.convertStringToArrayBuffer(window.atob(nonceBase64)));

    console.log('counter', this.counter);
    console.log('nonce', this.nonce);
    const privateKeyBase64 = wrappedPrivateKey.substring(this.privateKeyHeader.length + 1, wrappedPrivateKey.length - this.privateKeyFooter.length - 25);
    console.log(privateKeyBase64)
    return this.encoding.convertStringToArrayBuffer(window.atob(privateKeyBase64));
  }

  public static async generateHash(salt, passphrase){
    return await crypto.subtle.digest({name: 'SHA-256'}, new TextEncoder().encode(salt + passphrase));
  }
}
