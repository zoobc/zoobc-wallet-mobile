import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service';

describe('AddressBookService', () => {
    let service: AuthService;
  beforeEach(() => { TestBed.configureTestingModule({})
    service = new AuthService(null, null, null);
 });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("login worked", () => {
    let result = service.login("qwerty");
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("logout worked", () => {
    let result = service.logout();
    expect(Array.isArray(result)).toBeTruthy;
  });
//   it("user details worked", () => {
//     let result = service.userDetails();
//     expect(Array.isArray(result)).toBeTruthy;
//   });

    it("get balance by address worked", () => {
        let result = service.getBalanceByAddress("BCZ1234567");
        expect(Array.isArray(result)).toBeTruthy;
    });
    it("login user worked", () => {
        let result = service.loginUser("1");
        expect(Array.isArray(result)).toBeTruthy;
      });


      it("register user worked", () => {
        let result = service.registerUser("1");
        expect(Array.isArray(result)).toBeTruthy;
      });

      


});
