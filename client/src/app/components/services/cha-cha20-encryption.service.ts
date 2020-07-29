import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChaCha20EncryptionService {
  private readonly rounds = 20;
  private readonly constants = [0x61707865, 0x3523646e, 0x76626d32, 0x6b226544];
  private keyStream;
  private byteCounter = 0;
  private block;

  constructor() {
  }

  private rotate (data, shift) {
    return ((data << shift) | (data >>> (32 - shift)))
  }

  private quarterRound (output, a, b, c, d) {
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
  private getUint32 (data, index) {
    return data[index++] ^ (data[index++] << 8) ^ (data[index++] << 16) ^ (data[index] << 24)
  }

  private chachaBlock(key, nonce, counter){
    return [
      this.constants[0], this.constants[1], this.constants[2], this.constants[3],
      this.getUint32(key, 0), this.getUint32(key, 4), this.getUint32(key, 8), this.getUint32(key, 12),
      this.getUint32(key, 16), this.getUint32(key, 20), this.getUint32(key, 24), this.getUint32(key, 28),
      counter, this.getUint32(nonce, 0 ), this.getUint32(nonce, 4), this.getUint32(nonce, 8)
    ];
  }

  private chacha(key, nonce, counter){
    let mix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let b = 0
    this.block = this.chachaBlock(key, nonce, counter);

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
      this.keyStream[b++] = mix[i] & 0xFF
      this.keyStream[b++] = (mix[i] >>> 8) & 0xFF
      this.keyStream[b++] = (mix[i] >>> 16) & 0xFF
      this.keyStream[b++] = (mix[i] >>> 24) & 0xFF
    }
  }

  public update(key, nonce, counter, data){
    this.keyStream = new Array(64).fill(0);
    let output = new Uint8Array(data.length)
    this.byteCounter = 0;

    // core function, build block and xor with input data //
    for (let i = 0; i < data.length; i++) {
      if (this.byteCounter === 0 || this.byteCounter === 64) {
        // generate new block //

        this.chacha(key, nonce, counter);
        // counter increment //
        this.block[12]++;

        // reset internal counter //
        this.byteCounter = 0
      }

      output[i] = data[i] ^ this.keyStream[this.byteCounter++]
    }

    return output
  }

}
