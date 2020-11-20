import { TestBed } from '@angular/core/testing';
import { AccountService } from './account.service';
import { Account } from '../Interfaces/account';

export const account: Account[] = [ { 
    path: 1234,
    name: "stefano",
    nodeIP: "192.168.0.1",
    address: "8.8.8.8",
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

  it("add account worked", () => {
    let result = service.addAccount(account[0]);

    expect(Array.isArray(result)).toBeTruthy;
  });

  
  it("broadcast new account worked", () => {
    let result = service.broadCastNewAccount(account[0]);

    expect(Array.isArray(result)).toBeTruthy;
  });

  it("get all account worked", () => {
    let result = service.allAccount();
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("set recipient worked", () => {
    let result = service.setRecipient(account[0]);
    expect(Array.isArray(result)).toBeTruthy;
  });

  
  it("remove all account worked", () => {
    let result = service.removeAllAccounts();
    expect(Array.isArray(result)).toBeTruthy;
  });

  
//   it("get current account worked", () => {
//     let result = service.getCurrAccount();
//     expect(Array.isArray(result)).toBeTruthy;
//   });

  
  it("restore account worked", () => {
    let result = service.restoreAccounts();
    expect(Array.isArray(result)).toBeTruthy;
  });

  
  it("generate derivation path worked", () => {
    let result = service.generateDerivationPath();
    expect(Array.isArray(result)).toBeTruthy;
  });

  
  it("set active account worked", () => {
    let result = service.setActiveAccount(account[0]);
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("set array passphrasse worked", () => {
    let result = service.setArrayPassphrase(["test","crypto","passphrase"]);
    expect(Array.isArray(result)).toBeTruthy;
  });

//   it("create new account account worked", () => {
//     let result = service.createNewAccount("stefano", 0);
//     expect(Array.isArray(result)).toBeTruthy;
//   });


it("create initial account worked", () => {
    let result = service.createInitialAccount();
    expect(Array.isArray(result)).toBeTruthy;
  });



});