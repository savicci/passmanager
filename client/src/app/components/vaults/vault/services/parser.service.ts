import { Injectable } from '@angular/core';
import {Vault} from "../models";
import {RsaEncryptionService} from "../../../services/rsa-encryption.service";
import {AesEncryptionService} from "../../../services/aes-encryption.service";
import {EncodingService} from "../../../services/encoding.service";

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  constructor(private rsaEncryption: RsaEncryptionService, private aesEncryption: AesEncryptionService, private encoding: EncodingService) { }

  parseJsonToVaults(res) {
    let vaults = []
    let operations = []
    for(let [id, value] of Object.entries(res)){
      let promise = new Promise((resolve, reject) => {
        this.rsaEncryption.privateDecrypt(value['encryptedVaultKey'])
          .then(vaultPassphrase => {

            this.aesEncryption.generateAesKey(vaultPassphrase)
              .then(aesKey => {
                this.aesEncryption.decryptData(value['vaultData'], aesKey)
                  .then(decryptedVault => {
                    vaults.push({id: id, key: vaultPassphrase, data: JSON.parse(decryptedVault)});
                    return resolve;
                  })
                  .catch(err => {
                    console.warn('error decrypting data');
                    return reject;
                  })
              })
              .catch(err => {
                console.warn('error generating aes key');
                return reject;
              })
          })
          .catch(err => {
            console.warn('error decrypting vaultkey');
            return reject;
          })
      });
      operations.push(promise);
    }

    Promise.all(operations)
      .then(res => res)
      .catch(err => {
        console.warn(err);
      })
    return vaults;
  }
}
