import { TestBed } from '@angular/core/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
    let service: CryptoService;
    beforeEach(() => {
      TestBed.configureTestingModule({})
      service = new CryptoService(null);
    });
  
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it("should return a non empty array", () => {
        let result = service.getCrypto();
        expect(Array.isArray(result)).toBeTruthy;
      });

      it("should return a non empty array", () => {
        let result = service.genInitVector();
        expect(Array.isArray(result)).toBeTruthy;
      });
  });