import {AesEncryption} from "./AESEncryption";

export class RsaEncryption {
  private static publicKeyHeader: string = '-----BEGIN PUBLIC KEY-----';
  private static publicKeyFooter: string = '-----END PUBLIC KEY-----';
  private static privateKeyHeader: string = '-----BEGIN PRIVATE KEY-----';
  private static privateKeyFooter: string = '-----END PRIVATE KEY-----';
  private static readonly ivPlusPadding: number = 17;

  static async generateRsaKeyPair(): Promise<CryptoKeyPair> {
    return window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
      },
      true,
      ["encrypt", "decrypt"]
    );
  }

  static async publicEncrypt(data: ArrayBuffer, publicKey: CryptoKey): Promise<ArrayBuffer> {
    return window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      publicKey,
      data
    );
  }

  static async privateDecrypt(encodedData: Uint8Array | ArrayBuffer, privateKey: CryptoKey): Promise<ArrayBuffer> {
    return window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      privateKey,
      encodedData
    );
  }

  static async exportKeys(keys: CryptoKeyPair, symmetricKey: CryptoKey, iv: Uint8Array) {
    let publicKeyExport = await window.crypto.subtle.exportKey(
      "spki",
      keys.publicKey,
    );

    let privateKeyExport = await window.crypto.subtle.exportKey(
      "pkcs8",
      keys.privateKey,
    );
    privateKeyExport = await AesEncryption.encryptData(privateKeyExport, symmetricKey, iv);

    const publicKeyPem = this.wrapPublicKey(publicKeyExport);
    const privateKeyPem = this.wrapPrivateKey(privateKeyExport, iv);

    return {
      publicKey: publicKeyPem,
      privateKey: privateKeyPem
    };
  }

  static async importKeys(pemKeys, symmetricKey) {
    const unwrappedPublicKey = this.unwrapPublicKey(pemKeys.publicKey);

    const unwrappedPrivateKeyInfo = this.unwrapPrivateKey(pemKeys.privateKey);
    const decryptedPrivateKey = await AesEncryption.decryptData(unwrappedPrivateKeyInfo.encryptedPrivateKey, symmetricKey, unwrappedPrivateKeyInfo.iv);

    const publicKey = await window.crypto.subtle.importKey(
      "spki",
      unwrappedPublicKey,
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      true,
      ["encrypt"]
    );

    const privateKey = await window.crypto.subtle.importKey(
      "pkcs8",
      decryptedPrivateKey,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ["decrypt"]
    );

    const keyPair = {publicKey, privateKey};
    const iv = unwrappedPrivateKeyInfo.iv;
    return {keyPair, iv};
  }

  private static unwrapPrivateKey(wrappedPrivateKey) {
    const ivBase64 = wrappedPrivateKey.substring(wrappedPrivateKey.length - this.privateKeyFooter.length - this.ivPlusPadding, wrappedPrivateKey.length - this.publicKeyFooter.length - 1);
    const iv = new Uint8Array(this.stringToArrayBuffer(window.atob(ivBase64)));

    const privateKeyBase64 = wrappedPrivateKey.substring(this.privateKeyHeader.length + 1, wrappedPrivateKey.length - this.privateKeyFooter.length - this.ivPlusPadding);
    const encryptedPrivateKey = this.stringToArrayBuffer(window.atob(privateKeyBase64));

    return {encryptedPrivateKey, iv};
  }

  private static unwrapPublicKey(publicKey) {
    const pemKey = publicKey.substring(this.publicKeyHeader.length, publicKey.length - this.publicKeyFooter.length);
    const stringKey = window.atob(pemKey);
    return this.stringToArrayBuffer(stringKey);
  }

  private static wrapPublicKey(publicKey: ArrayBuffer): string {
    const publicKeyBase64 = window.btoa(String.fromCharCode.apply(null, new Uint8Array(publicKey)));
    return `${this.publicKeyHeader}\n${publicKeyBase64}\n${this.publicKeyFooter}`;
  }

  private static wrapPrivateKey(privateKey: ArrayBuffer, iv: Uint8Array): string {
    const privateKeyBase64 = window.btoa(String.fromCharCode.apply(null, new Uint8Array(privateKey)));
    const ivBase64 = window.btoa(String.fromCharCode.apply(null, iv));
    return `${this.privateKeyHeader}\n${privateKeyBase64}${ivBase64}\n${this.privateKeyFooter}`;
  }

  private static stringToArrayBuffer(str): ArrayBuffer {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
}
