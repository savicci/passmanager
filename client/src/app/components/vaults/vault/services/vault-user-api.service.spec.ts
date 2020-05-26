import { TestBed } from '@angular/core/testing';

import { VaultUserApiService } from './vault-user-api.service';

describe('VaultUserApiService', () => {
  let service: VaultUserApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VaultUserApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
