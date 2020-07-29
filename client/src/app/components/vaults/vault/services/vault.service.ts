import {Injectable} from '@angular/core';
import {Vault} from "../models";
import {UserService} from "../../../services/user.service";
import {AesEncryptionService} from "../../../services/aes-encryption.service";
import {VaultApiService} from "./vault-api.service";
import {RsaEncryptionService} from "../../../services/rsa-encryption.service";
import {EncodingService} from "../../../services/encoding.service";
import {ParserService} from "./parser.service";
import {HttpResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class VaultService {

  constructor(private userService: UserService,
              private aesEncryption: AesEncryptionService,
              private vaultApi: VaultApiService,
              private rsaEncryption: RsaEncryptionService,
              private encoding: EncodingService,
              private parser: ParserService) {
  }

  public async createNewVault(name: string) {
    let newVault = new Vault(name);
    const aesKeyPassphrase = this.aesEncryption.getRandom32ByteString()

    return this.aesEncryption.generateAesKey(aesKeyPassphrase)
      .then(aesKey => {
        this.aesEncryption.encryptData(JSON.stringify(newVault), aesKey)
          .then(encryptedVault => {
            this.rsaEncryption.publicEncrypt(aesKeyPassphrase)
              .then(encryptedVaultKey => {
                const requestBody = this.prepareAddRequest(name, encryptedVaultKey, encryptedVault);
                this.vaultApi.addNewVault(requestBody)
                  .then(res => res);
              })
          })
      })
      .catch(err => console.warn(err))
  }

  public getAllVaults() {
    return this.vaultApi.getAllVaults()
      .then((res: HttpResponse<any>) => {
        return this.parser.parseJsonToVaults(res.body.vaults);
      })
      .catch(err => {
        return [];
      })
  }

  public modifyVault(vault: Vault, id, vaultPassphrase) {
    vault.garbageData = this.generateGarbageData();
    return this.aesEncryption.generateAesKey(vaultPassphrase)
      .then(aesKey => {
        this.aesEncryption.encryptData(JSON.stringify(vault), aesKey)
          .then(encryptedVault => {
            this.vaultApi.modifyVault(id, encryptedVault)
          })
      })
  }

  deleteVault(id: any) {
    return this.vaultApi.deleteVault(id)
  }


  private prepareAddRequest(name: string, encryptedVaultKey: string, encryptedVault: string | void) {
    return {
      vaultName: name,
      encryptedVaultKey: encryptedVaultKey,
      vaultData: encryptedVault
    }
  }

  private generateGarbageData() {
    // between 0 and 512 bytes of data will be generated
    let numberOfBytes = Math.floor(Math.random() * 512);
    let arr = new Uint8Array((numberOfBytes || 40) / 2)
    crypto.getRandomValues(arr)
    let x = Array.from(arr, this.dec2hex).join('');
    console.log(x)
    return x;
  }

  dec2hex (dec) {
    return dec < 10 ? '0' + String(dec) : dec.toString(16)
  }
}
