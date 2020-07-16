import {Injectable} from '@angular/core';
import {RsaEncryption} from "./RsaEncryption";
import {AesEncryption} from "./AESEncryption";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private keys: CryptoKeyPair;
  private iv: Uint8Array;

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  async importKeys(response: any, passphrase: string) {
    const aesKey = await AesEncryption.generateAesKey(passphrase);
    const imported = await RsaEncryption.importKeys({
      publicKey: response.publicKey,
      privateKey: response.encryptedPrivateKey
    }, aesKey);
    this.keys = imported.keyPair;
    this.iv = imported.iv;
  }

  async publicEncrypt(data: string) {
    return RsaEncryption.publicEncrypt(new TextEncoder().encode(data), this.keys.publicKey)
      .then(res => res)
      .catch(err => {
        console.log(err);
        throw err;
      });
  }

  privateDecrypt(data: string){
    return RsaEncryption.privateDecrypt(new TextEncoder().encode(data), this.keys.privateKey)
      .then(res => {
       return res;
      })
      .catch(err => {
        console.warn(err);
        throw err;
      })
  }

  writeUserInfoToStorage(body) {
    sessionStorage.setItem('userInfo', JSON.stringify(body));
  }

  getUserInfoFromStorage() {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  decryptKeys(passphrase: any) {
    let userInfo = this.getUserInfoFromStorage();
    if (userInfo === null) {
      this.httpClient.get('/auth/user', {observe: 'response'}).toPromise()
        .then(res => {
          localStorage.setItem('userInfo', JSON.stringify(res.body));
          userInfo = res.body;
        })
        .catch(err => {
          localStorage.removeItem('authenticated');
          this.router.navigate(['/login']);
        })
    }

    return this.importKeys(userInfo, passphrase)
  }
}
