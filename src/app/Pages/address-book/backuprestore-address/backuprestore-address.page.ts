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
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, OnInit } from '@angular/core';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { AlertController } from '@ionic/angular';
import { Account } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
@Component({
  selector: 'app-backuprestore-address',
  templateUrl: './backuprestore-address.page.html',
  styleUrls: ['./backuprestore-address.page.scss'],
})
export class BackuprestoreAddressPage implements OnInit {
  uid: string;
  accounts: Account[];
  addresses = [];
  addressName: string;
  addressAddress: string;
  isBackup = false;
  isRestore = false;
  isBackupFinish = false;
  isRestoreFinish = false;
  isAddressValid = true;
  isNameValid = true;
  validationMessage = '';
  numBerOfRestored = 0;
  counter = 0;

  constructor(
    private addressBookSrv: AddressBookService,
    private accountService: AccountService,
    private alertController: AlertController) { }

  ngOnInit() {
    this.getAllAddress();
    this.getAllAccounts();

  }

  async getAllAccounts() {
    this.accounts = await this.accountService.allAccount();
  }

  async getAllAddress() {
    this.addresses = await this.addressBookSrv.getAll();
  }

  backup() {
    if (!this.addresses || this.addresses.length < 1) {
      this.presentAlert();
      return;
    }

    this.isBackupFinish = false;
    this.isBackup = true;
    setTimeout(async () => {
      this.isBackup = false;
      this.isBackupFinish = true;
    }, 5000);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'No contact to backup!.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async createBackup() {
  }

  restore() {
    this.counter = 1;
    this.isRestore = true;
    this.isRestoreFinish = false;
    this.isRestore = false;
    this.isRestoreFinish = true;
  }

  isNameExists(name: string, address: string) {
    this.validationMessage = '';
    let finded = false;
    this.addresses.forEach(obj => {
      if (String(name).valueOf() === String(obj.name).valueOf() &&
        String(address).valueOf() !== String(obj.address).valueOf()) {
        this.validationMessage = 'Name is exist, with address: ' + obj.address ;
        finded = true;
      }
    });

    return finded;
  }


  isAddressExists(address: string) {
    this.validationMessage = '';
    let finded = false;

    this.addresses.forEach(obj => {
      if (String(address).valueOf() === String(obj.address).valueOf()) {
        this.validationMessage = 'Address is exist, with name: ' + obj.name;
        finded = true;
      }
    });
    return finded;
  }

}
