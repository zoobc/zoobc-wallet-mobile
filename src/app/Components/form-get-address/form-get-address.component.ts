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

import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Account } from 'src/app/Interfaces/account';
import { Contact } from 'src/app/Interfaces/contact';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { QrScannerService } from 'src/app/Services/qr-scanner.service';
import { PopoverAccountComponent } from 'src/app/Components/popover-account/popover-account.component';
import { PopoverOptionComponent } from 'src/app/Components/popover-option/popover-option.component';

@Component({
  selector: 'app-form-get-address',
  templateUrl: './form-get-address.component.html',
  styleUrls: ['./form-get-address.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormGetAddressComponent),
      multi: true
    }
  ]
})
export class FormGetAddressComponent implements OnInit, OnDestroy, ControlValueAccessor {
  constructor(
    private router: Router,
    private popoverCtrl: PopoverController,
    private qrScannerSrv: QrScannerService,
    private addressBookSrv: AddressBookService,
    private translateSrv: TranslateService
  ) {}

  @Input() identity: string;

  private textContacts: string;
  private textAccounts: string;
  private textNewAddress: string;

  qrScannerSubscription: any;
  addressSubscription: any;

  public buttonTitle: string;
  public address: Contact;
  public textAddress: string;
  public isNewAddress: boolean;

  ngOnInit() {
    this.isNewAddress = true;

    this.addressSubscription = this.addressBookSrv.addressSubject.subscribe(
      ({ identity, address }: any) => {
        if (identity === this.identity) {
          this.textAddress = address.address;
          this.buttonTitle = address.name;
          this.isNewAddress = false;
          this.onChange(address);
        }
      }
    );

    this.qrScannerSubscription = this.qrScannerSrv.qrScannerSubject.subscribe(
      str => {
        const results = str.split('||');
      }
    );

    this.translateSrv.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateLang();
    });

    this.translateLang();
  }

  translateLang() {
    this.translateSrv.get([
      'contacts',
      'my accounts',
      'new address'
  ]).subscribe((res: any) => {
      this.textContacts = res.contacts;
      this.textAccounts = res['my accounts'];
      this.textNewAddress = res['new address'];
      this.buttonTitle = this.textNewAddress;
    });
  }

  ngOnDestroy() {
    if (this.addressSubscription) {
      this.addressSubscription.unsubscribe();
    }
    if (this.qrScannerSubscription) {
      this.qrScannerSubscription.unsubscribe();
    }
  }

  openListAccount(arg: string) {
    const navigationExtras: NavigationExtras = {
      state: {
        forWhat: arg
      }
    };
    this.router.navigate(['list-account'], navigationExtras);
  }

  goToScan(arg: string) {
    // this.scanForWhat = arg;
    this.router.navigateByUrl('/qr-scanner');
  }

  changeTextAddress() {
    if (this.isNewAddress) {
      this.onChange({ name: '', address: this.textAddress });
    }
  }

  async showAccount(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopoverAccountComponent,
      event: ev,
      cssClass: 'popover-account',
      translucent: true
    });

    popover.onWillDismiss().then(async ({ data }: { data: Account }) => {
      if (data) {
        this.textAddress = data.address.value;
        this.buttonTitle = data.name;
        this.isNewAddress = false;
        this.onChange({
          name: data.name,
          address: data.address.value
        });
      }
    });

    return popover.present();
  }

  async showOption(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopoverOptionComponent,
      componentProps: {
        options: [
          {
            key: 'contact',
            label: this.textContacts
          },
          {
            key: 'my-account',
            label: this.textAccounts
          },
          {
            key: 'new-address',
            label: this.textNewAddress
          }
        ]
      },
      event: ev,
      translucent: true
    });

    popover.onWillDismiss().then(({ data }) => {
      switch (data) {
        case 'contact':
          const extras: NavigationExtras = {
            state: {
              forWhat: this.identity
            }
          };
          this.router.navigate(['/address-book'], extras);
          break;
        case 'my-account':
          this.showAccount(ev);
          break;
        case 'new-address':
          this.buttonTitle = this.textNewAddress;
          this.isNewAddress = true;
          this.textAddress = '';
          this.onChange({
            name: '',
            address: ''
          });
          break;
      }
    });

    return popover.present();
  }

  onChange = (value: Contact) => {};

  onTouched = () => {};

  writeValue(value: Contact) {
    this.address = value;
    if (value) {
      this.textAddress = value.address;
    }
  }

  registerOnChange(fn: (value: Contact) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
}
