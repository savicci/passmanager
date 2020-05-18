import {TestBed} from '@angular/core/testing';

import {AesEncryptionService} from './aes-encryption.service';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {RouterTestingModule} from "@angular/router/testing";

describe('AesEncryptionService', () => {
  let service: AesEncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, RouterTestingModule]
    });
    service = TestBed.inject(AesEncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('testing test', async () => {
    const key = await service.generateAesKey(service.getRandom32ByteString());
    const dataToTest = 'fafjhjnklb230909[v;na209jf-0v-z01no90fv-0-905423';

    const encrypted = await service.encryptData(dataToTest, key);

    const decrypted = await service.decryptData(encrypted, key);

    console.log('result');
    expect(new TextDecoder().decode(decrypted)).toEqual(dataToTest)
  });

  function str2ab(str) {
    var buf = new ArrayBuffer(str.length); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
});
