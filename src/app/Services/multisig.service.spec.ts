import { TestBed } from '@angular/core/testing';
import { CreateAccountService } from './create-account.service';

describe('CreateAccountService', () => {
  let service: CreateAccountService;
  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = new CreateAccountService(null, null);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should return a non empty array", () => {
    let result = service.createInitialAccount();
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("should return a non empty array", () => {
    let result = service.getPassphrase();
    expect(Array.isArray(result)).toBeTruthy;
  });


  // it("should return a non empty array", () => {
  //   let result = service.createNewAccount("BCZ", 1234);
  //   expect(Array.isArray(result)).toBeTruthy;
  // });

});
