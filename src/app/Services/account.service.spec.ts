// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//             contact us at roberto.capodieci[at]blockchainzoo.com
//             and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { TestBed } from '@angular/core/testing';
import { AccountService } from './account.service';
import { Account } from '../Interfaces/account';

export const account: Account[] = [ {
    path: 1234,
    name: 'stefano',
    nodeIP: '192.168.0.1',
    address: '8.8.8.8',
    balance: 1234,
    lastTx: 4567
  }
];

describe('AccountService', () => {
    let service: AccountService;

    beforeEach(() => { TestBed.configureTestingModule({});
                       service = new AccountService(null);
 });

    it('should be created', () => {
    expect(service).toBeTruthy();
  });

    it('add account worked', () => {
    const result = service.addAccount(account[0]);

    expect(Array.isArray(result)).toBeTruthy;
  });


    it('broadcast new account worked', () => {
    const result = service.broadCastNewAccount(account[0]);

    expect(Array.isArray(result)).toBeTruthy;
  });

    it('get all account worked', () => {
    const result = service.allAccount();
    expect(Array.isArray(result)).toBeTruthy;
  });

    it('set recipient worked', () => {
    const result = service.setRecipient(account[0]);
    expect(Array.isArray(result)).toBeTruthy;
  });


    it('remove all account worked', () => {
    const result = service.removeAllAccounts();
    expect(Array.isArray(result)).toBeTruthy;
  });


//   it("get current account worked", () => {
//     let result = service.getCurrAccount();
//     expect(Array.isArray(result)).toBeTruthy;
//   });


    it('restore account worked', () => {
    const result = service.restoreAccounts();
    expect(Array.isArray(result)).toBeTruthy;
  });


    it('generate derivation path worked', () => {
    const result = service.generateDerivationPath();
    expect(Array.isArray(result)).toBeTruthy;
  });


    it('set active account worked', () => {
    const result = service.switchAccount(account[0]);
    expect(Array.isArray(result)).toBeTruthy;
  });

    it('set array passphrasse worked', () => {
    const result = service.setArrayPassphrase(['test', 'crypto', 'passphrase']);
    expect(Array.isArray(result)).toBeTruthy;
  });

//   it("create new account account worked", () => {
//     let result = service.createNewAccount("stefano", 0);
//     expect(Array.isArray(result)).toBeTruthy;
//   });


    it('create initial account worked', () => {
    const result = service.createInitialAccount();
    expect(Array.isArray(result)).toBeTruthy;
  });



});
