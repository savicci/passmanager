import { Injectable } from '@angular/core';
import {VaultUserApiService} from "./vault-user-api.service";
import {AesEncryptionService} from "../../../services/aes-encryption.service";
import {HttpResponse} from "@angular/common/http";
import {RsaEncryptionService} from "../../../services/rsa-encryption.service";

@Injectable({
  providedIn: 'root'
})
export class VaultUserService {

  constructor(private vaultUserApiService: VaultUserApiService, private rsaEncryption: RsaEncryptionService) { }

  addUserToVault(email: string, id: string, key: any, role) {
    return this.vaultUserApiService.getUserPublicKey(email)
      .then((res: HttpResponse<any>) => {
        console.log('got user public key')
        return this.rsaEncryption.encryptKey(key, res.body)
      })
      .then(encryptedKey => {
        return this.vaultUserApiService.addUserToVault(email, encryptedKey, id, role)
      })
      .catch(err => {
        throw err;
      })
  }

  getAllVaultUsers(id: string) {
    return this.vaultUserApiService.getAllUsers(id)
      .catch(err => {
        throw err;
      })
  }

  modifyPermissions(role: any, email: any, vaultId: any) {
    return this.vaultUserApiService.modifyPermissions(role, email, vaultId);
  }

  deleteUser(email: any, vaultId: any) {
    return this.vaultUserApiService.deleteUser(email, vaultId);
  }
}
