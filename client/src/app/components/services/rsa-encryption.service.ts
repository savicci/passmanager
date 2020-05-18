import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AesEncryption} from "../encryption/AESEncryption";
import {RsaEncryption} from "../encryption/RsaEncryption";
import {ErrorHandlingService} from "./error-handling.service";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class RsaEncryptionService {
  private encoderToUint8Array = new TextEncoder();

  private keys: CryptoKeyPair;
  private iv: Uint8Array;

  constructor(private httpClient: HttpClient,
              private router: Router,
              private errorHandler: ErrorHandlingService,
              private userService: UserService) {
  }

  decryptKeys(passphrase: any) {
    return this.importRsaKeys(this.userService.getUserInfo(), passphrase);
  }

  publicEncrypt(data: string) {
    return RsaEncryption.publicEncrypt(this.encoderToUint8Array.encode(data), this.keys.publicKey)
      .then(res => res)
      .catch(err => {
        throw this.errorHandler.handleEncryptionError('Error during public encryption', err)
      });
  }

  privateDecrypt(data: string) {
    return RsaEncryption.privateDecrypt(this.encoderToUint8Array.encode(data), this.keys.privateKey)
      .then(res => res)
      .catch(err => {
        throw this.errorHandler.handleEncryptionError('Error during private decryption', err)
      });
  }

  private importRsaKeys(response: any, passphrase: string): Promise<any> {
    return AesEncryption.generateAesKey(passphrase)
      .then(aesKey => {
        RsaEncryption.importKeys({publicKey: response.publicKey, privateKey: response.encryptedPrivateKey}, aesKey)
          .then(res => {
            this.keys = res.keyPair;
            this.iv = res.iv;
          })
          .catch(err => {
            throw this.errorHandler.handleEncryptionError('Error during keyPair import', err)
          })
      })
      .catch(err => {
        throw this.errorHandler.handleEncryptionError('Error during key generation', err)
      })
  }
}
