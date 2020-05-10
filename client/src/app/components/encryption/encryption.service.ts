import { Injectable } from '@angular/core';
import {RsaEncryption} from "./RsaEncryption";
import {AesEncryption} from "./AESEncryption";

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private keys: CryptoKeyPair;
  private iv: Uint8Array;

  constructor() { }

  async importKeys(response: any, passphrase: string){
    const aesKey = await AesEncryption.generateAesKey(passphrase);
    const imported = await RsaEncryption.importKeys({publicKey: response.publicKey, privateKey: response.encryptedPrivateKey}, aesKey);
    this.keys = imported.keyPair;
    this.iv = imported.iv;
  }

  async publicEncrypt(data: string){
    return RsaEncryption.publicEncrypt(new TextEncoder().encode(data), this.keys.publicKey)
      .then(res => res)
      .catch(err => {console.log(err); return err;});
  }
}
