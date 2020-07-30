

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


  static importPublicKey(publicKey){
    const unwrappedPublicKey = this.unwrapPublicKey(publicKey);
    return window.crypto.subtle.importKey(
      "spki",
      unwrappedPublicKey,
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      true,
      ["encrypt"]
    );
  }



  private static unwrapPublicKey(publicKey) {
    const pemKey = publicKey.substring(this.publicKeyHeader.length, publicKey.length - this.publicKeyFooter.length);
    const stringKey = window.atob(pemKey);
    return this.stringToArrayBuffer(stringKey);
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
