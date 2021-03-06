import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RsaEncryption} from "./RsaEncryption";
import {Router} from "@angular/router";
import {RsaEncryptionService} from "./rsa-encryption.service";
import {UserService} from "./user.service";

@Injectable()
export class AuthenticationService {

  constructor(private httpClient: HttpClient,
              private encryptionService: RsaEncryptionService,
              private router: Router,
              private userService: UserService) {
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
    const nonce = crypto.getRandomValues(new Uint8Array(8));
    const counter = crypto.getRandomValues(new Uint8Array(8));
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
