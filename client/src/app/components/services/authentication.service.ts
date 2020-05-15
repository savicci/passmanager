import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RsaEncryption} from "../encryption/RsaEncryption";
import {AesEncryption} from "../encryption/AESEncryption";
import {EncryptionService} from "../encryption/encryption.service";

@Injectable()
export class AuthenticationService {

  constructor(private httpClient: HttpClient, private encryptionService: EncryptionService) {
  }

  public async register(data: any) {
    await this.setUpRequestBody(data)
      .then(body => {
        return this.httpClient.post('/auth/register', body, {responseType: 'text'}).toPromise()
      })
      .catch(err => {
        throw err;
      })
  }

  async setUpRequestBody(data: any) {
    const keys = await RsaEncryption.generateRsaKeyPair();
    const aesKey = await AesEncryption.generateAesKey(data.passphrase);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    return RsaEncryption.exportKeys(keys, aesKey, iv)
      .then(exportedKeys => {
        console.log('then authentication');
        return {
          email: data.email,
          password: data.password,
          encryptedPrivateKey: exportedKeys.privateKey,
          publicKey: exportedKeys.publicKey
        }
      })
      .catch(() => {
        throw new Error('Could not export keys');
      })
  }

  public async login(data: any) {
    const httpHeaders = new HttpHeaders({Authorization: 'Basic ' + btoa(data.email + ':' + data.password)});
    return this.httpClient.get('auth/user', {headers: httpHeaders, observe: 'response'}).toPromise()
      .then(res => {
        this.encryptionService.writeUserInfoToStorage(res.body);
        localStorage.setItem('authenticated', 'true');
      })
      .catch((err) => {
        localStorage.removeItem('authenticated');
        throw new Error('Wrong email or password provided');
      })
  }

  isAuthenticated() {
    const item = localStorage.getItem('authenticated');
    return item ? item === 'true' : false;
  }

  logout() {
    return this.httpClient.get('/auth/logout', {responseType: 'text'}).toPromise()
      .then(() => {
          localStorage.removeItem('authenticated');
        }
      ).catch(() => {
        localStorage.removeItem('authenticated');
        throw new Error('Could not deauthenticate')
      })
  }
}
