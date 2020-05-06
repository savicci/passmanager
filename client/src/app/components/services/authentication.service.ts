import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";
import {RsaEncryption} from "../encryption/RsaEncryption";
import {AesEncryption} from "../encryption/AESEncryption";
import {EncryptionService} from "../encryption/encryption.service";

@Injectable()
export class AuthenticationService {

  constructor(private httpClient: HttpClient, private encryptionService: EncryptionService) {
  }

  public async register(data: any) {
    const body = await this.setUpRequestBody(data);

    this.httpClient.post('/auth/register', body, {responseType: 'text'}).pipe(
      catchError(err => {
        console.error(err);
        return of(err)
      })
    ).subscribe(response => console.log(response));
  }

  public login(data: any, passphrase: string) {
    const httpHeaders = new HttpHeaders({Authorization: 'Basic ' + btoa(data.email + ':' + data.password)});

    this.httpClient.get('auth/user', {headers: httpHeaders}).pipe(
      catchError(err => {
        console.error(err);
        return of(err)
      })
    ).subscribe(response => this.encryptionService.importKeys(response, passphrase));
  }

  private async setUpRequestBody(data: any) {
    const keys = await RsaEncryption.generateRsaKeyPair();
    const aesKey = await AesEncryption.generateAesKey(data.passphrase);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const exportedKeys = await RsaEncryption.exportKeys(keys, aesKey, iv);
    return {
      email: data.email,
      password: data.password,
      encryptedPrivateKey: exportedKeys.privateKey,
      publicKey: exportedKeys.publicKey
    }
  }
}
