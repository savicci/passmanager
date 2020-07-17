import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AesEncryption} from "../encryption/AESEncryption";
import {RsaEncryption} from "../encryption/RsaEncryption";
import {ErrorHandlingService} from "./error-handling.service";
import {UserService} from "./user.service";
import {EncodingService} from "./encoding.service";

@Injectable({providedIn: 'root'})
export class RsaEncryptionService {
  private keys: CryptoKeyPair;
  private iv: Uint8Array;

  constructor(private httpClient: HttpClient,
              private router: Router,
              private errorHandler: ErrorHandlingService,
              private userService: UserService,
              private encoding: EncodingService) {
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
    const aesKey = await AesEncryption.generateAesKey(response.username, passphrase);
    const imported = await RsaEncryption.importKeys({
      publicKey: response.publicKey,
      privateKey: response.encryptedPrivateKey
    }, aesKey);
    this.keys = imported.keyPair;
    this.iv = imported.iv;
  }

  encryptKey(keyPassphrase: any, publicKey: any) {
    return RsaEncryption.importPublicKey(publicKey)
      .then(key => {
        return RsaEncryption.publicEncrypt(this.encoding.convertStringToArrayBuffer(keyPassphrase), key)
          .then(res =>  this.encoding.convertArrayBufferToString(res));
      });
  }
}
