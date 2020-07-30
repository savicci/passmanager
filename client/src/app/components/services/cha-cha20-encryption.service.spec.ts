import { TestBed } from '@angular/core/testing';

import { ChaCha20EncryptionService } from './cha-cha20-encryption.service';

describe('ChaCha20EncryptionService', () => {
  let service: ChaCha20EncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChaCha20EncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();

    const key = new Uint8Array([
      0x00, 0x01, 0x02, 0x03, 0x04,
      0x05, 0x06, 0x07, 0x08, 0x09,
      0x0a, 0x0b, 0x0c, 0x0d, 0x0e,
      0x0f, 0x10, 0x11, 0x12, 0x13,
      0x14, 0x15, 0x16, 0x17, 0x18,
      0x19, 0x1a, 0x1b, 0x1c, 0x1d,
      0x1e, 0x1f
    ])

    const nonce = new Uint8Array([
      0x48, 0x12, 0x00, 0x00,
      0x73,  0xa3, 0xc3, 0x4a,
    ])

    const counter = new Uint8Array([
      0x6a, 0x26, 0x00, 0x62,
      0x3a, 0x61, 0x73, 0x15,
    ]);

    // const text = new Uint8Array([
    //   0x4c, 0x61, 0x64, 0x69, 0x65, 0x73, 0x20, 0x61, 0x6e, 0x64, 0x20, 0x47, 0x65, 0x6e, 0x74, 0x6c,
    //   0x65, 0x6d, 0x65, 0x6e, 0x20, 0x6f, 0x66, 0x20, 0x74, 0x68, 0x65, 0x20, 0x63, 0x6c, 0x61, 0x73,
    //   0x73, 0x20, 0x6f, 0x66, 0x20, 0x27, 0x39, 0x39, 0x3a, 0x20, 0x49, 0x66, 0x20, 0x49, 0x20, 0x63,
    //   0x6f, 0x75, 0x6c, 0x64, 0x20, 0x6f, 0x66, 0x66, 0x65, 0x72, 0x20, 0x79, 0x6f, 0x75, 0x20, 0x6f,
    //   0x6e, 0x6c, 0x79, 0x20, 0x6f, 0x6e, 0x65, 0x20, 0x74, 0x69, 0x70, 0x20, 0x66, 0x6f, 0x72, 0x20,
    //   0x74, 0x68, 0x65, 0x20, 0x66, 0x75, 0x74, 0x75, 0x72, 0x65, 0x2c, 0x20, 0x73, 0x75, 0x6e, 0x73,
    //   0x63, 0x72, 0x65, 0x65, 0x6e, 0x20, 0x77, 0x6f, 0x75, 0x6c, 0x64, 0x20, 0x62, 0x65, 0x20, 0x69,
    //   0x74, 0x2e
    // ])

    const text = new TextEncoder().encode('tese4rq9fyc-tnh03f7u34n89tv348q9gajogqp38jhg9vuihbZ*&(fhv4389qphfv89pap9ega34ga' +
      'rhsrth45wshae089ghuj8934qug6748dc74d8c654sd8654sd4568fdtyusxr568srur6s564s563az7u6trd743za5674s7564a3z4375ss534as47345assa4357435ass347374s734sd437573e45ertysreexywszwexyrt46yws5x37453d5763d4ceexrcsexyrwex6ws3x63w6x6w34w63');
    console.log(text);

    let cipherText = service.update(key, nonce, counter, text);
    console.log('encrypted')

    let decrypted = service.update(key, nonce, counter, cipherText);
    console.log(decrypted);

  });
});