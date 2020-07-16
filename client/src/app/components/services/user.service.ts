import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ErrorHandlingService} from "./error-handling.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, private errorHandler: ErrorHandlingService) { }

  refreshUserInfo() {
    return this.httpClient.get('/auth/user', {observe: 'response'}).toPromise()
      .then(res => {
        sessionStorage.setItem('userInfo', JSON.stringify(res.body));
      })
      .catch(err => {
        this.errorHandler.handleHttpError(err);
        sessionStorage.removeItem('userInfo');
      })
  }

  getUserInfo() {
    const infoString = localStorage.getItem('userInfo');
    if(infoString !== null){
      return JSON.parse(infoString);
    }
    this.refreshUserInfo()
      .then(() => {
        return JSON.parse(localStorage.getItem('userInfo'));
      })
  }
}
