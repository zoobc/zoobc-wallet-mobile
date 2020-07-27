import { TestBed } from '@angular/core/testing';
import { ConverterService } from './converter.service';

describe('ConverterService', () => {
    let service: ConverterService;
    beforeEach(() => {
      TestBed.configureTestingModule({})
      service = new ConverterService();
    });
  
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it("should return a non empty array", () => {
        let result = service.stringToArrayByte("qwerty");
        expect(Array.isArray(result)).toBeTruthy;
      });

      it("should return a non empty array", () => {
        let result = service.hexToArrayByte("#00ff00");
        expect(Array.isArray(result)).toBeTruthy;
      });
  });