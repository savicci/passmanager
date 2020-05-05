import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";

@Injectable()
export class AuthenticationService {

  constructor(private httpClient: HttpClient) {
  }

  public register(data: any) {
    let testData = {
      email: 'email',
      password: 'password',
      encryptedPrivateKey: 'privateKey',
      publicKey: 'publicKey'
    }

    this.httpClient.post('/auth/register', testData, {responseType: 'text'}).pipe(
      catchError(err => {
        console.error(err);
        return of(err)
      })
    ).subscribe(response => console.log(response));
  }

  public login(data: any) {
    const httpHeaders = new HttpHeaders({Authorization: 'Basic ' + btoa(data.email + ':' + data.password)});

    this.httpClient.get('auth/user', {headers: httpHeaders}).pipe(
      catchError(err => {console.error(err); return of(err)})
    ).subscribe(response => console.log(response));
  }
}
