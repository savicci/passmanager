import { TestBed } from '@angular/core/testing';

import { EncryptionService } from './encryption.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {EncodingService} from "../services/encoding.service";

describe('EncryptionService', () => {
  let service: EncryptionService;
  let encoding: EncodingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, RouterTestingModule],
      providers: [EncodingService]
    });
    service = TestBed.inject(EncryptionService);
    encoding = TestBed.inject(EncodingService)
  });

  it('should be created', async () => {
    localStorage.setItem('userInfo', '{"password":null,"encryptedPrivateKey":"-----BEGIN PRIVATE KEY-----\\nTXqXOnppEMZSeX1wfXa59tJpA10UW78Roo6YXPdSDK5vR5Pz2ZJaQ8BspMJfY6L45hpWrYQ2qMRXhedHNDlWVdONK5vK9/Y4iSBN9y0bI1nCyxxJ4B+EyANVK3FkCjalukwLw02t7DqNGJGK1d+tsdbQjixTwdGafSdV35hWICFor7EUFKSGkUA6AtW+fD6s2hCebnjzIMaMmhv47lcLQJ/qi2rZrgyEtSly4UV4i3RTo5PVNYpyYQS1+i+cFMJwAbQKU7v6fHZs7G5jAVM6tAVcW/7hZQB1TS8eUcBNaiVx6ozN5OGgVtgp6+zrOpa7a+zcEN7Cdr/uKkHgFsjkz1hrwZ/2Yqh8f3Xa14VaHcsYvxJESBOyuvueqhART7aDz8My42JALeurq1YNo/ByUgQs/SzgVN/F5on96TtZsDwfWZsvdXcobQmJdbv9QBtehIuJTJJ7+SuecjVnSYV0skQwSZMB+ynm8+VuL4s878VoXApbVkHLbDQVlC8emEFEoqe46VbTBtKXerKYySjPk+R+z4NTuigWhvH5AsisA3gcqx3q/6EM6ssZYkX16QHXOeH8AOiQio1eV/f49c6ZipyT0Cj0sq31uZ2ZcilrrWbgfK0JbThVTEXpmPgHSsuNEWDFhcGVoU6QKcORwWA6y8w0kMzCIeBhHCuFrvbAaDf18fEIy+GvzCk2CN6iT8ZwGyFEpjIgawLMZ5p/uicvUI2sr24mHaryBpnYLmkY4sf4OMda6lRz4DA/PD6BiqDyTXZbO0kel0Tz0Qamjt1t/YKOYrYwivSQZmdB87Y3hQ1Cv1FL3cdw4VkoJwf63DVEiczqy4v/kIv3yIwG2Ppx3PeCKovBb0nYFKdhbYAc8klwqoz09ZGSaYB1Qw3Gywjkdwd5QSfb768W7xNQLNydFNfaa/gtv4Hcv+G9yxQLKKHgaoB2Qd6gvUuWy7ZgGTfR8cF6Uezu3BB+N81bwQX4K+4q42+KKsjOQvYD9OiurQhlnE/XlwZO4lSeu5jGsmrTUYTo1SW8VTIjN2tTPsYMS/oaasQlBFo9bWW0IkoXdACvvRkfdQG6Gyk0nwPLikg5w/0baFqCAqM3tjTUEl8e2pbjS+x5qbzo401qJM16kdwIunIDSg/hPdpU03zeuVhjSYjh0IjuobISIFSRyuUzjCQmL/pB/5IICPVYNhWigEWWSYe1r3CVlb2UK6j6CUXFe5DG0NRe/q5hAzV+M0E/+slOom+SgIXnvOPK9DwrWf/O4npT9qYHjW/Po5Ih87WbTVyPuxB4FKRvBy3e44b1JamwDEk8iUuEhyzVIlswdO8SvVuljgJ7jIMX0Kuyd9r2dul1egbjXL474lJ7WcwXwo09QPKtGWjc1BKVgNUwsm4Y03h0tyhNPVv8AtoZNWhpbJA2V1aC1wUFbBCCmOVGz7rYuFjtZLQv8WIL663FRX9UJBcZc4IeE5g2luueOVb3wKj4qPVfOY1smVL3TEiUeOlAySG0yzy23malCk9jyl+SIDrY6AJ7o197KTYbP+5L3EZNzVmy5+T+wzWUoW8/6j26mK4KM59xNU5QNDXdGRpe5jdMzTMUusLPvTNr5jD+YqMX2qIMb31ueg5pq4nKMWepIGIzmjHGUDQ43G48vK0oSA==nUnj2C8EdPKpPmEM\\n-----END PRIVATE KEY-----","publicKey":"-----BEGIN PUBLIC KEY-----\\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvNq1sT9rsm5yIe9uu8OqXBEY+hK6679KuXFTEvFKIyZL1rerFUHBgCTledbob4lpti5nQPMRXXOg666xKcS/eFy9zSCKArcevf/qcGqQ9U47lMU69CKXWDCEy1+Zsrns6z51Qd5E+bk0AnhqUzw/jycVY1mtOJPxjluIVnRtHyv0CngQeeOQPaOpPH9HvkBuhZHWHHIloUCFnqIHUB41n+sB1NyP+g8cKqNzYuj1CzvjOiP8P/2Dni7FYNGasQoF2gTFAJlpdMHgvYOy6t6zRuOgyG2SQRi+EydK+WMvEOmdlBGyTeYHql7Bl0vm4T0OLaY7nwsT9qAt7GnX+JgXtwIDAQAB\\n-----END PUBLIC KEY-----","enabled":false,"username":"user@email.com","authorities":[],"accountNonExpired":false,"accountNonLocked":false,"credentialsNonExpired":false}')

    const data = 'fgjiogjvispjbijxfb';
    await service.importKeys(service.getUserInfoFromStorage(), 'passphrase');
    const encrypted = await service.publicEncrypt(data);
    const decrypted = await service.privateDecrypt(encoding.convertArrayBufferToString(encrypted))
    console.log(decrypted);
  });
});
