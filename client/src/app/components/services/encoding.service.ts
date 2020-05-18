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
}
