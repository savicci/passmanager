import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RsaEncryption} from "../encryption/RsaEncryption";
import {AesEncryption} from "../encryption/AESEncryption";
import {Router} from "@angular/router";
import {RsaEncryptionService} from "./rsa-encryption.service";
import {UserService} from "./user.service";
import {ChaCha20EncryptionService} from "./cha-cha20-encryption.service";

@Injectable()
export class AuthenticationService {

  constructor(private httpClient: HttpClient,
              private encryptionService: RsaEncryptionService,
              private router: Router,
              private userService: UserService,
              private chacha: ChaCha20EncryptionService) {
  }

  public async register(data: any) {
    await this.setUpRequestBody(data)
      .then(body => {
        console.log(body);
        return this.httpClient.post('/auth/register', body, {responseType: 'text'}).toPromise()
      })
      .catch(err => {
        throw err;
      })
  }

  async setUpRequestBody(data: any) {
    const keys = await RsaEncryption.generateRsaKeyPair();
    const nonce = crypto.getRandomValues(new Uint8Array(8));
    console.log('nonce', window.btoa(String.fromCharCode.apply(null, nonce)));
    const counter = crypto.getRandomValues(new Uint8Array(8));
    console.log('counter', window.btoa(String.fromCharCode.apply(null, counter)));
    const chachaKey = await AuthenticationService.generateHash(data.email, data.passphrase);

    return this.encryptionService.exportKeys(keys, chachaKey, nonce, counter)
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

  public getUserEmail() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (userInfo === null) {
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
      })
      .catch((err) => {
        throw new Error('Wrong email or password provided');
      })
  }

  isAuthenticated() {
    return sessionStorage.getItem('userInfo') != null;
  }

  logout() {
    return this.httpClient.get('/auth/logout', {responseType: 'text'}).toPromise()
      .then(() => {
          sessionStorage.removeItem('userInfo');
          this.router.navigate(['/'])
        }
      ).catch(() => {
        sessionStorage.removeItem('userInfo');
        this.router.navigate(['/'])
        throw new Error('Could not deauthenticate')
      })
  }

  public static async generateHash(salt, passphrase){
    return await crypto.subtle.digest({name: 'SHA-256'}, new TextEncoder().encode(salt + passphrase));
  }
}
