import {Injectable} from '@angular/core';
import {VaultResponse} from "../models";
import {RsaEncryptionService} from "../../../services/rsa-encryption.service";
import {EncodingService} from "../../../services/encoding.service";
import {ChaCha20EncryptionService} from "../../../services/cha-cha20-encryption.service";

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  constructor(private rsaEncryption: RsaEncryptionService,
              private encoding: EncodingService,
              private chacha: ChaCha20EncryptionService) {
  }

  parseJsonToVaults(res) {
    let vaults = []
    let operations = []
    for (let [id, value] of Object.entries(res)) {
      let promise = new Promise((resolve, reject) => {
        this.rsaEncryption.privateDecrypt(value['encryptedVaultKey'])
          .then(vaultPassphrase => {
            const decryptedVault = this.chacha.decryptVault(value['vaultData'], vaultPassphrase)
            vaults.push(this.createVaultResponse(id, value, vaultPassphrase, decryptedVault));
          })
          .catch(err => {
            console.warn('error decrypting data');
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

  private createVaultResponse(id: string, value: unknown, vaultPassphrase: any, decryptedVault): VaultResponse {
    return {
      id: id,
      key: vaultPassphrase,
      data: JSON.parse(decryptedVault),
      role: value['role'],
      modifiedBy: value['modifiedBy'],
      modifiedDate: value['modifiedDate'] === null ? null : new Date(value['modifiedDate']),
      createdBy: value['createdBy'],
      createdDate: new Date(value['createdDate'])
    }
  }
}
