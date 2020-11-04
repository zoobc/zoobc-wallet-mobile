import { TestBed } from '@angular/core/testing';
import { FcmService } from './fcm.service';
import { Account } from '../Interfaces/account';
import { ChatUser } from '../Interfaces/chat-user';
// export const account: Account[] = [ { 
//     path: 1234,
//     name: "stefano",
//     nodeIP: "192.168.0.1",
//     address: "8.8.8.8",
//     shortAddress: "4.4.4.4",
//     created: new Date(),
//     balance: 1234,
//     lastTx: 4567
//   }
// ]

// export const chatuser: ChatUser[] = [ { 
//   name: "leonardo",
//   path: 1234,
//   address: "8.8.8.8",
//   token: "teweytr2341",
//   uid: "qwert",
//   time: 200800
// }
// ]


// describe('FcmService', () => {
//   let service: FcmService;
//   beforeEach(() =>{
//   TestBed.configureTestingModule({})
//     service = new FcmService(null, null, null, null);
// });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it("should return a non empty array", () => {
//     let result = service.getToken(account[0]);
//     expect(Array.isArray(result)).toBeTruthy;
//   });

//   it("should return a non empty array", () => {
//     let result = service.initialize();
//     expect(Array.isArray(result)).toBeTruthy;
//   });

// });
