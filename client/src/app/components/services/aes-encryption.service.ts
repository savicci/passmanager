import {Injectable} from '@angular/core';
import {AesEncryption} from "../encryption/AESEncryption";
import {ErrorHandlingService} from "./error-handling.service";
import {EncodingService} from "./encoding.service";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AesEncryptionService {
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  constructor(private errorHandler: ErrorHandlingService, private encoding: EncodingService, private userService: UserService) {
  }


  public generateAesKey(passphrase: string) {
    return AesEncryption.generateAesKey('', passphrase)
      .then(res => res)
      .catch(err => {
        throw this.errorHandler.handleEncryptionError('Error during aes key generation', err)
      });
  }

  encryptData(data: string, key: CryptoKey) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    return AesEncryption.encryptData(this.encoder.encode(data), key, iv)
      .then((res: ArrayBuffer) => {
        return this.encoding.convertArrayBufferToString(this.concatBuffers(res, iv.buffer));
      })
      .catch(err => {
        throw this.errorHandler.handleEncryptionError('Error during aes encryption', err)
      });
  }

  decryptData(str: string, key: CryptoKey) {
    const uint8Array = new Uint8Array(this.encoding.convertStringToArrayBuffer(str));
    const buffer = uint8Array.buffer;
    const iv = buffer.slice(buffer.byteLength - 12);
    const data = buffer.slice(0, buffer.byteLength - 12);
    return AesEncryption.decryptData(new Uint8Array(data), key, new Uint8Array(iv))
      .then(res => {
        return this.encoding.convertArrayBufferToString(res);
      })
      .catch(err => {
        throw this.errorHandler.handleEncryptionError('Error during aes decryption', err)
      });
  }

  getRandom32ByteString() {
    return Array.from(
      crypto.getRandomValues(new Uint8Array(32)),
      (dec) => ('0' + dec.toString(16)).substr(-2)).join('');
  }

  private concatBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer {
    let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
  };

   private arrayBufferToBase64( buffer ) {
    let binary = '';
    let bytes = new Uint8Array( buffer );
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }
}
