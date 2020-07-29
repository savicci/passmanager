import {Injectable} from '@angular/core';
import {EncodingService} from "./encoding.service";
import {Vault} from "../vaults/vault/models";

@Injectable({
  providedIn: 'root'
})
export class ChaCha20EncryptionService {
  private readonly rounds = 20;
  private readonly constants = [0x61707865, 0x3523646e, 0x76626d32, 0x6b226544];
  private keyStream;
  private byteCounter;
  private block;

  constructor(private encoding: EncodingService) {
  }

  public encryptVault(vaultData: Vault, vaultKeyPassphrase: string) {
    const nonce = crypto.getRandomValues(new Uint8Array(8));
    console.log('nonce', nonce)
    const counter = crypto.getRandomValues(new Uint8Array(8));
    console.log('counter', counter)
    const key = new Uint8Array(this.encoding.convertStringToArrayBuffer(vaultKeyPassphrase));
    const data = new Uint8Array(this.encoding.convertStringToArrayBuffer(JSON.stringify(vaultData)));

    const encryptedVault = this.update(key, nonce, counter, data);
    console.log('encryptedVault', encryptedVault);
    const concatenatedBuffer = this.encoding.concatBuffers(encryptedVault.buffer, nonce.buffer, counter.buffer);
    return this.encoding.convertArrayBufferToString(concatenatedBuffer);
  }

  public decryptVault(encryptedVault: string, vaultKeyPassphrase: string): string{
    const nonce = this.encoding.stringToUint8Arr(encryptedVault.substring(encryptedVault.length - 16, encryptedVault.length - 8));
    const counter = this.encoding.stringToUint8Arr(encryptedVault.substring(encryptedVault.length - 8));
    const vault = this.encoding.stringToUint8Arr(encryptedVault.substring(0, encryptedVault.length - 16));
    const key = this.encoding.stringToUint8Arr(vaultKeyPassphrase);

    const decryptedVault = this.update(key, nonce, counter, vault);
    return this.encoding.convertArrayBufferToString(decryptedVault.buffer);
  }


  public getRandom32ByteString() {
    return Array.from(
      crypto.getRandomValues(new Uint8Array(32)),
      (dec) => ('0' + dec.toString(16)).substr(-2)).join('');
  }

  public update(key, nonce, counter, data) {
    this.keyStream = new Array(64).fill(0);
    let output = new Uint8Array(data.length)
    this.byteCounter = 0;

    //build block and xor with input data
    for (let i = 0; i < data.length; i++) {
      if (this.byteCounter === 0 || this.byteCounter === 64) {
        // generate new block
        this.generateChaChaBlock(key, nonce, counter);

        counter = this.incrementCounter(counter);

        // reset internal counter
        this.byteCounter = 0
      }

      // xor generated stream with input
      output[i] = data[i] ^ this.keyStream[this.byteCounter++]
    }

    return output
  }

  private rotate(data, shift) {
    return ((data << shift) | (data >>> (32 - shift)))
  }

  private quarterRound(output, a, b, c, d) {
    output[d] = this.rotate(output[d] ^ (output[a] += output[b]), 16)
    output[b] = this.rotate(output[b] ^ (output[c] += output[d]), 12)
    output[d] = this.rotate(output[d] ^ (output[a] += output[b]), 8)
    output[b] = this.rotate(output[b] ^ (output[c] += output[d]), 7)

    // make uint32
    output[a] >>>= 0
    output[b] >>>= 0
    output[c] >>>= 0
    output[d] >>>= 0
  }

  // little endian to uint32
  private getUint32(data, index) {
    return data[index++] ^ (data[index++] << 8) ^ (data[index++] << 16) ^ (data[index] << 24)
  }

  private generateChaChaBlockBlock(key, nonce, counter) {
    return [
      this.constants[0], this.constants[1], this.constants[2], this.constants[3],
      this.getUint32(key, 0), this.getUint32(key, 4), this.getUint32(key, 8), this.getUint32(key, 12),
      this.getUint32(key, 16), this.getUint32(key, 20), this.getUint32(key, 24), this.getUint32(key, 28),
      this.getUint32(counter, 0), this.getUint32(counter, 4), this.getUint32(nonce, 0), this.getUint32(nonce, 4)
    ];
  }

  private generateChaChaBlock(key, nonce, counter) {
    let mix = new Array(16).fill(0);
    let keyStreamByteCounter = 0
    this.block = this.generateChaChaBlockBlock(key, nonce, counter);

    // copy param array to mix //
    for (let i = 0; i < 16; i++) {
      mix[i] = this.block[i];
    }

    // mix rounds //
    for (let i = 0; i < this.rounds; i += 2) {
      this.quarterRound(mix, 0, 4, 8, 12)
      this.quarterRound(mix, 1, 5, 9, 13)
      this.quarterRound(mix, 2, 6, 10, 14)
      this.quarterRound(mix, 3, 7, 11, 15)

      this.quarterRound(mix, 0, 5, 10, 15)
      this.quarterRound(mix, 1, 6, 11, 12)
      this.quarterRound(mix, 2, 7, 8, 13)
      this.quarterRound(mix, 3, 4, 9, 14)
    }

    for (let i = 0; i < 16; i++) {
      // add
      mix[i] += this.block[i];

      // store keystream
      this.keyStream[keyStreamByteCounter++] = mix[i] & 0xFF
      this.keyStream[keyStreamByteCounter++] = (mix[i] >>> 8) & 0xFF
      this.keyStream[keyStreamByteCounter++] = (mix[i] >>> 16) & 0xFF
      this.keyStream[keyStreamByteCounter++] = (mix[i] >>> 24) & 0xFF
    }
  }

  private incrementCounter(counter) {
    this.block[12]++;
    this.block[13]++;

    // convert uint32 values to uint8 arrays
    let newCounter = new Uint8Array(8);
    let firstPartCounter = this.getUint8ArrFromUint32(this.block[12])
    let secondPartCounter = this.getUint8ArrFromUint32(this.block[13])

    // set bytes on uint8array
    for (let i = 0; i < 4; i++) {
      newCounter[i] = firstPartCounter[i];
      newCounter[i + 3] = secondPartCounter[i + 3];
    }

    return newCounter;
  }

  private getUint8ArrFromUint32(blockElement: any) {
    let arr = new ArrayBuffer(4);
    let dataView = new DataView(arr);
    dataView.setInt32(0, blockElement, true);
    return new Uint8Array(arr);
  }
}
