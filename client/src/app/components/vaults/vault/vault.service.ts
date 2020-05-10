import { Injectable } from '@angular/core';
import {Vault} from "./models";
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {RsaEncryption} from "../../encryption/RsaEncryption";
import {EncryptionService} from "../../encryption/encryption.service";

@Injectable({
  providedIn: 'root'
})
export class VaultService {

  constructor(private httpClient: HttpClient, private encryptionService: EncryptionService) { }

  public async createNewVault(name: string){
    const vault = this.setUpTestVault();
    const vaultKey = crypto.getRandomValues(new Uint8Array(256));

    console.log(new TextDecoder().decode(vaultKey));
    const encryptedVault = await this.encryptionService.publicEncrypt(JSON.stringify(vault));
    const encryptedVaultKey = await this.encryptionService.publicEncrypt(new TextDecoder().decode(vaultKey));

    console.log('ecnrypted key');
    console.log(encryptedVaultKey);

    console.log('ecnrypted vault');
    console.log(encryptedVault);

    const requestBody = {
      vaultName: vault.vaultName,
      vaultData: new TextDecoder().decode(encryptedVault),
      encryptedVaultKey: new TextDecoder().decode(encryptedVaultKey)
    }

    console.log(JSON.stringify(requestBody));

    this.httpClient.post('/vault/add', JSON.stringify(requestBody))
      .pipe(catchError(err => {console.error(err); return err;}))
      .subscribe(response => console.log(response));
  }

  private setUpTestVault() {
    let vault = new Vault('vaultNameTest');
    vault.createdAt = new Date();
    vault.rows = [];
    return vault;
  }
}
