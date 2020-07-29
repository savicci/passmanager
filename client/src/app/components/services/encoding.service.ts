import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncodingService {

  constructor() {
  }

  public convertArrayBufferToString(buf: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  public convertStringToArrayBuffer(str: string): ArrayBuffer {
    let buffer = new ArrayBuffer(str.length);
    let bufView = new Uint8Array(buffer);
    for (let i = 0; i < str.length; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buffer;
  }

  public concatBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer, buffer3: ArrayBuffer){
    let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength + buffer3.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    tmp.set(new Uint8Array(buffer3), buffer1.byteLength + buffer2.byteLength);
    return tmp.buffer;
  }

  stringToUint8Arr(str: string) {
    return new Uint8Array(this.convertStringToArrayBuffer(str));
  }
}
