import { TestBed } from '@angular/core/testing';
import { AccountService } from './account.service';
import { Account } from '../Interfaces/account';

export const account: Account[] = [ { 
    path: 1234,
    name: "stefano",
    nodeIP: "192.168.0.1",
    address: "8.8.8.8",
    shortAddress: "4.4.4.4",
    created: new Date(),
    balance: 1234,
    lastTx: 4567
  }
]

describe('AccountService', () => {
    let service: AccountService;
    let recipient: Account;

  beforeEach(() => { TestBed.configureTestingModule({})
    service = new AccountService(null);
 });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should return a non empty array", () => {
    let result = service.addAccount(account[0]);

    expect(Array.isArray(result)).toBeTruthy;
  });

  
  it("should return a non empty array", () => {
    let result = service.broadCastNewAccount(account[0]);

    expect(Array.isArray(result)).toBeTruthy;
  });

  it("should return a non empty array", () => {
    let result = service.getAllAccount();

    expect(Array.isArray(result)).toBeTruthy;
  });

  it("should return a non empty array", () => {
    let result = service.setRecipient(account[0]);
    let getResult = service.getRecipient();
    expect(Array.isArray(result)).toBeTruthy;
    expect(Array.isArray(getResult)).toBeTruthy;
  });



});