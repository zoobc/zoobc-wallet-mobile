import { TestBed } from '@angular/core/testing';
import { KeyringService } from './keyring.service';

describe('KeyringService', () => {
    let service: KeyringService;
    beforeEach(() => {
      TestBed.configureTestingModule({})
      service = new KeyringService(null, null, null);
    });
  
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it("should return a non empty array", () => {
        let result = service.getNetwork("localhost");
        expect(Array.isArray(result)).toBeTruthy;
      });

  });