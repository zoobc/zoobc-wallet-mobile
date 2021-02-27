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

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  STORAGE_ADDRESS_BOOK,
  CONST_UNKNOWN_NAME
} from 'src/environments/variable.const';
import { StorageService } from './storage.service';
import { Contact } from '../Interfaces/contact';
@Injectable({
  providedIn: 'root'
})
export class AddressBookService {

  counter = 0;
  private selectedAddress: string;
  private addresses: any;

  public addressSubject: Subject<string> = new Subject<string>();
  public recipientSubject: Subject<any> = new Subject<any>();
  public approverSubject: Subject<any> = new Subject<any>();
  public signBySubject: Subject<any> = new Subject<any>();
  public participantSubject: Subject<any> = new Subject<any>();

  public getSelectedAddress() {
    return this.selectedAddress;
  }

  public setSelectedAddress(arg) {
    this.selectedAddress = arg;
    this.addressSubject.next(arg);
  }

  public setApproverAddress(arg: any) {
    this.approverSubject.next(arg);
  }

  public setRecipientAddress(arg: any) {
    this.recipientSubject.next(arg);
  }

  public setSignBy(arg: any) {
    this.signBySubject.next(arg);
  }
  public setParticipant(arg: any) {
    this.participantSubject.next(arg);
  }


  constructor(
    private strgSrv: StorageService
  ) {
    this.selectedAddress = '';
    this.addresses = this.getAll();
  }

  async getAll() {
    try {
      return this.strgSrv.getObject(STORAGE_ADDRESS_BOOK);
    } catch (error) {
      console.log(error);
    }
  }

  async getOneByIndex(index: number) {
    const addressBooks = await this.strgSrv.getObject(STORAGE_ADDRESS_BOOK);
    return addressBooks[index];
  }

  async getNameByAddress(address: string) {
    let name = '';
    await this.addresses.then(addresses => {
      if (addresses && addresses.length > 0) {
        addresses.forEach((obj: { name: any; address: string }) => {
          if (String(address).valueOf() === String(obj.address).valueOf()) {
            name = obj.name;
          }
        });
      }
    });
    return name;
  }

  async updateByIndex(contact: Contact, idx: number) {
    const allAddress = await this.getAll();
    allAddress[idx] = contact;
    await this.update(allAddress);
  }

  async insertBatch(addresses) {
    this.addresses = [];

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < addresses.length; i++) {
      const dt = addresses[i];
      this.addresses.push({
        name: dt.name,
        address: dt.address
      });
    }
    await this.update(this.addresses);
  }

  async insert(contact: Contact) {
    let allAddress = await this.getAll();
    if (!allAddress) {
      allAddress = [];
    }

    let name = contact.name;
    const newAddress = allAddress.slice();

    if (CONST_UNKNOWN_NAME === name) {
      name = CONST_UNKNOWN_NAME + '-' + (allAddress.length + 1);
    }
    contact.name = name;
    newAddress.push(contact);
    await this.update(newAddress);
  }

  async update(addresses: any) {
    this.addresses = addresses;
    await this.strgSrv.setObject(STORAGE_ADDRESS_BOOK, addresses);
  }

}
