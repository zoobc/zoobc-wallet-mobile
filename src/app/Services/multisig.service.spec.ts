import { TestBed } from '@angular/core/testing';
import { MultisigService } from './multisig.service';

describe('MultisigService', () => {
  let service: MultisigService;
  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = new MultisigService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it("save draft worked", () => {
    let result = service.saveDraft();
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("edit draft worked", () => {
    let result = service.editDraft();
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("delete draft worked", () => {
    let result = service.deleteDraft(1);
    expect(Array.isArray(result)).toBeTruthy;
  });

});
