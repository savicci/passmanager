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
        console.log(err);
        throw this.errorHandler.handleHttpError(err);
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
        throw this.errorHandler.handleHttpError(err);
      })
  }
}
