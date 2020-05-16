import {Injectable} from '@angular/core';
import {Vault} from "./models";
import {HttpClient} from "@angular/common/http";
import {EncryptionService} from "../../encryption/encryption.service";
import {AuthenticationService} from "../../services/authentication.service";
import {AesEncryption} from "../../encryption/AESEncryption";

@Injectable({
  providedIn: 'root'
})
export class VaultService {

  constructor(private httpClient: HttpClient, private encryptionService: EncryptionService, private authentication: AuthenticationService) {
  }

  createNewVault(name: string) {
    let vault = new Vault(name, this.authentication.getUserEmail());
    let vaultKey = this.generateVaultKey();
    let iv = crypto.getRandomValues(new Uint8Array(12));

    AesEncryption.generateAesKey(vaultKey)
      .then(key => {
        AesEncryption.encryptData(new TextEncoder().encode(JSON.stringify(vault)), key, iv)
          .then(encryptedVault => {
            this.encryptionService.publicEncrypt(vaultKey)
              .then(encryptedVaultKey => {
                const requestBody = {
                  vaultName: name,
                  vaultData: encryptedVault,
                  encryptedVaultKey: encryptedVaultKey
                };

                this.httpClient.post('/vault/add', requestBody).toPromise()
                  .then(res => {
                    console.log(res);
                  })
                  .catch(err => {
                    console.warn(err);
                  })
              })
          })
      })

  }

  private generateVaultKey() {
    return Array.from(
      crypto.getRandomValues(new Uint32Array(256)),
      (dec) => ('0' + dec.toString(16)).substr(-2)).join('');
  }
}
