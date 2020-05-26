import { TestBed } from '@angular/core/testing';

import { VaultUserService } from './vault-user.service';

describe('VaultUserService', () => {
  let service: VaultUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VaultUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
