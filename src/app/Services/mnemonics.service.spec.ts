import { TestBed } from '@angular/core/testing';
import { MnemonicsService } from './mnemonics.service';

describe('MnemonicsService', () => {
  let service: MnemonicsService;
  beforeEach(() => { 
    TestBed.configureTestingModule({})
    service = new MnemonicsService(1);
  });

  it('should be created',() => {
    expect(service).toBeTruthy();
  });

  // it("set default word list worked", () => {
  //   let result = service.setDefaultWordlist("ID");
  //   expect(Array.isArray(result)).toBeTruthy;
  // });
});
