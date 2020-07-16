export class AesEncryption {
  static async generateAesKey(passphrase: string): Promise<CryptoKey> {
    //TODO add salt
    const rawKey = await crypto.subtle.digest({name: 'SHA-256'}, new TextEncoder().encode(passphrase));
    return window.crypto.subtle.importKey(
      "raw",
      rawKey,
      "AES-GCM",
      true,
      ["encrypt", "decrypt"]
    );
  }

  static async encryptData(data: Uint8Array | ArrayBuffer, key: CryptoKey, iv: Uint8Array): Promise<ArrayBuffer> {
    return window.crypto.subtle.encrypt({
      name: 'AES-GCM',
      iv: iv
    }, key, data);
  }

  static async decryptData(encodedData: ArrayBuffer, key: CryptoKey, iv: Uint8Array): Promise<ArrayBuffer> {
    return window.crypto.subtle.decrypt({
      name: 'AES-GCM',
      iv: iv
    }, key, encodedData);
  }
}
