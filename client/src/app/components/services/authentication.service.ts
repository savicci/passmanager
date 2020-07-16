import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RsaEncryption} from "../encryption/RsaEncryption";
import {AesEncryption} from "../encryption/AESEncryption";
import {EncryptionService} from "../encryption/encryption.service";
import {Router} from "@angular/router";
import {RsaEncryptionService} from "./rsa-encryption.service";
import {UserService} from "./user.service";

@Injectable()
export class AuthenticationService {

  constructor(private httpClient: HttpClient, private encryptionService: RsaEncryptionService, private router: Router, private userService: UserService) {
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

  public getUserEmail(){
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(userInfo === null){
      sessionStorage.removeItem('passphraseProvided');
      this.router.navigate(['/login']);
    }
    return userInfo.username;
  }

  public async login(data: any) {
    const httpHeaders = new HttpHeaders({Authorization: 'Basic ' + btoa(data.email + ':' + data.password)});
    return this.httpClient.get('auth/user', {headers: httpHeaders, observe: 'response'}).toPromise()
      .then(res => {
        this.userService.setUserInfo(res.body);
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
