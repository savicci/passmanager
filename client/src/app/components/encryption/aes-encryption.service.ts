import { Injectable } from '@angular/core';
import {AesEncryption} from "./AESEncryption";

@Injectable({
  providedIn: 'root'
})
export class AesEncryptionService {

  constructor() { }

  encryptData(uint8Array: Uint8Array, key: CryptoKey, iv: Uint8Array) {
    return AesEncryption.encryptData(new Uint8Array([...uint8Array, ...iv]), key, iv)
  }

  decryptData(vault: string, key: CryptoKey){
    const iv = vault.substr(vault.length - 12);
    const vaultData = vault.substr(0, vault.length - 12);
    return AesEncryption.decryptData(new TextEncoder().encode(vaultData), key, new TextEncoder().encode(iv));
  }
}
