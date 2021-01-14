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

import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { ToastController} from '@ionic/angular';
import { NavigationExtras, Router, NavigationEnd } from '@angular/router';
import { MODE_EDIT, MODE_NEW } from 'src/environments/variable.const';

@Component({
  selector: 'app-address-book-list',
  templateUrl: './address-book-list.component.html',
  styleUrls: ['./address-book-list.component.scss']
})
export class AddressBookListComponent implements OnInit, OnDestroy {
  @Output() itemClicked = new EventEmitter<string>();

  addresses = [];
  navigationSubscription: any;

  constructor(
    private router: Router,
    private addressBookSrv: AddressBookService,
    private toastController: ToastController
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.getAllAddress();
      }
    });
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
    this.getAllAddress();
  }

  ionViewWillEnter() {
  }

  async getAllAddress() {
    const alladdress = await this.addressBookSrv.getAll();
    if (alladdress) {
      this.addresses = alladdress;
    }
  }

  copyAddress(index: string | number) {

    const val =   this.addresses[index];
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val.address;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.copySuccess();
  }

  async copySuccess() {
    const toast = await this.toastController.create({
      message: 'Copied to clipboard.',
      duration: 2000
    });

    toast.present();
  }

  selectAddress(index: number) {
    const address = this.addresses[index];
    this.itemClicked.emit(address.address);
  }

  editAddress(index: number) {
    const address = this.addresses[index];
    this.openAddressdForm(address, index, MODE_EDIT);
  }

  deleteAddress(index: number) {
    this.addresses.splice(index, 1);
    this.addressBookSrv.update(this.addresses);
  }

  createNewAddress() {
    this.openAddressdForm({name: '', address: ''}, 0, MODE_NEW);
  }

  async openAddressdForm(arg: any, idx: number, trxMode: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        name: arg.name,
        address: arg.address,
        mode: trxMode,
        index: idx
      }
    };
    this.router.navigate(['/add-address'], navigationExtras);
  }
}
