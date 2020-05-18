import {Injectable} from '@angular/core';
import {Vault} from "./models";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {EncryptionService} from "../../encryption/encryption.service";
import {AuthenticationService} from "../../services/authentication.service";
import {AesEncryption} from "../../encryption/AESEncryption";
import {Router} from "@angular/router";
import {AesEncryptionService} from "../../encryption/aes-encryption.service";

@Injectable({
  providedIn: 'root'
})
export class VaultService {

  constructor(private httpClient: HttpClient, private encryptionService: EncryptionService, private authentication: AuthenticationService, private router: Router, private aesEncryption: AesEncryptionService) {
  }

  createNewVault(name: string) {
    let vault = new Vault(name, this.authentication.getUserEmail());
    let vaultKey = this.generateVaultKey();
    let iv = crypto.getRandomValues(new Uint8Array(12));

    AesEncryption.generateAesKey(vaultKey)
      .then(key => {
        this.aesEncryption.encryptData(new TextEncoder().encode(JSON.stringify(vault)), key, iv)
          .then(res => {
            const encryptedVault = btoa(String.fromCharCode(...new Uint8Array(res)));
            this.encryptionService.publicEncrypt(vaultKey)
              .then(res => {
                const encryptedVaultKey = btoa(String.fromCharCode(...new Uint8Array(res)));

                const requestBody = {
                  vaultName: name,
                  encryptedVaultKey: encryptedVaultKey,
                  vaultData: encryptedVault
                }

                this.httpClient.post('/vault/add', requestBody, {observe: 'response'}).toPromise()
                  .then(res => {
                    console.log(res);
                  })
                  .catch((err: HttpErrorResponse) => {
                    if((err.status === 401)){
                      localStorage.removeItem('authenticated');
                      this.router.navigate(['/login']);
                    }
                  })

              })
              .catch(err => {
                console.warn(err);
              })

          })
          .catch(err => {
            console.warn(err);
          })
      })

  }

  private generateVaultKey() {
    return Array.from(
      crypto.getRandomValues(new Uint32Array(32)),
      (dec) => ('0' + dec.toString(16)).substr(-2)).join('');
  }

  getAllVaults() {
    return this.httpClient.get('/vault/all')
      .toPromise()
      .then(res => {
        return res;
      })
      .catch((err: HttpErrorResponse) => {
        if(err.status === 401){
          this.router.navigate(['/login']);
        }
      });
  }
}
