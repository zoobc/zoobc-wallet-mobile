import { TestBed } from '@angular/core/testing';
import { AddressBookService } from './address-book.service';
import { Account } from 'src/app/Interfaces/account';


const account: Account = {
    path: 0,
    name : "test",
    nodeIP : "192.168.1.1",
    address : "QWERTY",
  
  };

describe('AddressBookService', () => {
    let service: AddressBookService;
  beforeEach(() => { TestBed.configureTestingModule({})
    service = new AddressBookService(null, null);
 });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it("should return a non empty array", () => {
//     let result = service.insert(account);

//     expect(Array.isArray(result)).toBeTruthy;
//   });

//   it("should return a non empty array", () => {
//     let result = service.getAll();
//     expect(Array.isArray(result)).toBeTruthy;
//   });

//   it("should return a non empty array", () => {
//     let result = service.update(account);
//     expect(Array.isArray(result)).toBeTruthy;
//   });

});
