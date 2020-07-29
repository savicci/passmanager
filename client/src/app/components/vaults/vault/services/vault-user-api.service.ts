import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ErrorHandlingService} from "../../../services/error-handling.service";

@Injectable({
  providedIn: 'root'
})
export class VaultUserApiService {

  constructor(private httpClient: HttpClient, private errorHandler: ErrorHandlingService) { }


  getUserPublicKey(email: string) {
    return this.httpClient.get(`/vaultuser/key?email=${email}`, {observe: 'response', responseType: 'text'}).toPromise()
      .then(res => res)
      .catch(err => {
        throw err;
      })
  }

  addUserToVault(email, encryptedKey, id, role) {
    const requestBody = {
      vaultId: id,
      emailToAdd: email,
      encryptedVaultKey: encryptedKey,
      role: role
    };
    console.log(requestBody);
    return this.httpClient.post('/vaultuser/add', requestBody, {observe: 'response', responseType: 'text'}).toPromise()
      .then(res => {
        console.log(res);
        return res;
      })
      .catch(err => {
        throw err;
      })
  }

  getAllUsers(id: string) {
    return this.httpClient.get(`/vaultuser/all?id=${id}`, {observe: 'response'}).toPromise()
      .catch(err => {
        throw this.errorHandler.handleHttpError(err);
      })
  }

  modifyPermissions(role: any, email: any, vaultId: any) {
    const requestBody = {
      vaultId: vaultId,
      email: email,
      newRole: role
    }
    return this.httpClient.post('/vaultuser/changepermission', requestBody, {observe: 'response', responseType: 'text'}).toPromise()
      .catch(err => {
        throw err;
      })
  }

  deleteUser(email: any, vaultId: any) {
    const requestBody= {
      vaultId: vaultId,
      email: email
    }
    return this.httpClient.post('/vaultuser/delete', requestBody, {observe: 'response', responseType: 'text'})
      .toPromise()
      .catch(err => {
        throw err;
      })
  }
}
