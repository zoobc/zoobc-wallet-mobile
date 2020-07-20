import { TestBed } from '@angular/core/testing';
import { MnemonicsService } from './mnemonics.service';

describe('MnemonicsService', () => {
  let service: MnemonicsService;
  beforeEach(() => { 
    TestBed.configureTestingModule({})
    service = new MnemonicsService(2020);
  });

  // it('should be created',() => {
  //   expect(service).toBeTruthy();
  // });
  // it("should return a non empty array", () => {
  //   let result = service.generateMnemonicWords(1);
  //   expect(Array.isArray(result)).toBeTruthy;
  // });
});
