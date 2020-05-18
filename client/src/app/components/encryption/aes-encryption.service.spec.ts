import { TestBed } from '@angular/core/testing';

import { AesEncryptionService } from './aes-encryption.service';

describe('AesEncryptionService', () => {
  let service: AesEncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AesEncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
