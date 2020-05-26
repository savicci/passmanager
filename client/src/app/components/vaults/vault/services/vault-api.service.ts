import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorHandlingService} from "../../../services/error-handling.service";

@Injectable({
  providedIn: 'root'
})
export class VaultApiService {

  constructor(private httpClient: HttpClient, private errorHandler: ErrorHandlingService) {
  }

  public addNewVault(requestBody) {
    return this.httpClient.post('/vault/add', requestBody, {observe: 'response', responseType: 'text'}).toPromise()
      .then(res => {
        return res;
      })
      .catch(err => {
        throw this.errorHandler.handleHttpError(err);
      })
  }

  public getAllVaults() {
    return this.httpClient.get('/vault/all', {observe: 'response'}).toPromise()
      .then(res => {
        return res;
      })
      .catch(err => {
        throw this.errorHandler.handleHttpError(err);
      })
  }

  modifyVault(id, encryptedVault) {
    const requestBody = {'vaultDataByVaultId': {[id]: encryptedVault}};
    return this.httpClient.post('/vault/update', requestBody, {observe: 'response', responseType: 'text'}).toPromise()
      .then(res => res)
      .catch(err => {
        throw this.errorHandler.handleHttpError(err);
      })
  }

  deleteVault(id: any) {
    return this.httpClient.post('/vault/delete', {'vaultId': id}, {observe: 'response', responseType: 'text'}).toPromise()
      .catch(err => {
        throw this.errorHandler.handleHttpError(err);
      })
  }
}
