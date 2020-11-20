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

    it("get crypto worked", () => {
        let result = service.getCrypto();
        expect(Array.isArray(result)).toBeTruthy;
      });

      it("get init vector worked", () => {
        let result = service.genInitVector();
        expect(Array.isArray(result)).toBeTruthy;
      });

      
      it("gen derive algo worked", () => {
        let result = service.genDeriveAlgo();
        expect(Array.isArray(result)).toBeTruthy;
      });

    //   it("browser random worked", () => {
    //     let result = service.browserRandom(1,["Array"]);
    //     expect(Array.isArray(result)).toBeTruthy;
    //   });

    //   it("get crypto subtle worked", () => {
    //     let result = service.getCryptoSubtle();
    //     expect(Array.isArray(result)).toBeTruthy;
    //   });

  });