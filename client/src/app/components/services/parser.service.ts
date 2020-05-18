import { Injectable } from '@angular/core';
import {Vault, VaultRow} from "../vaults/vault/models";
import {EncryptionService} from "../encryption/encryption.service";
import {AesEncryption} from "../encryption/AESEncryption";
import {AesEncryptionService} from "../encryption/aes-encryption.service";

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  constructor(private encryption: EncryptionService, private aesEncryption: AesEncryptionService) { }

  parseVaultsResponse(response): Vault[] {
    console.log(response.vaults);

    const vaults = [];
    for(const key of Object.keys(response.vaults)) {
      const value = response.vaults[key];
      let vault: Vault = new Vault(value.vaultName, value.createdBy);
      vault.createdAt = value.createdDate;
      vault.modifiedDate = value.modifiedDate
      vault.id = Number.parseInt(key);
      vault.role = value.role;

      // this.encryption.privateDecrypt(value.encryptedVaultKey)
      //   .then(vaultKey => {
      //     vault.key = vaultKey;
      //     console.log(vaultKey);
      //     this.aesEncryption.decryptData(value.vaultData, vaultKey)
      //       .then(res => {
      //         console.log(res);
      //       })
      //       .catch(err => {
      //         console.warn(err);
      //       })
      //   })
      //   .catch(err => {
      //     console.warn(err);
      //   })
    }

    return [];
  }
}
