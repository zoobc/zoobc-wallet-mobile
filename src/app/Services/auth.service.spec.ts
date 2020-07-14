import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service';

describe('AddressBookService', () => {
    let service: AuthService;
  beforeEach(() => { TestBed.configureTestingModule({})
    service = new AuthService(null, null, null, null);
 });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should return a non empty array", () => {
    let result = service.login("qwerty");
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("should return a non empty array", () => {
    let result = service.isPinValid("qwerty","qwerty");
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("should return a non empty array", () => {
    let result = service.logout();
    expect(Array.isArray(result)).toBeTruthy;
  });

});
