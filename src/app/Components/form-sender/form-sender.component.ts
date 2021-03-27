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

import {
  Component,
  forwardRef,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { Account, AccountType } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
import { PopoverAccountComponent } from 'src/app/Components/popover-account/popover-account.component';
import zoobc from 'zbc-sdk';
import { TransactionService } from 'src/app/Services/transaction.service';

@Component({
  selector: 'app-form-sender',
  templateUrl: './form-sender.component.html',
  styleUrls: ['./form-sender.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSenderComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class FormSenderComponent implements OnInit, ControlValueAccessor {
  public account: Account;
  @Input() accountType: AccountType;
  @Input() canSwitch = 'yes';
  @Input() switchToActive = 'yes';
  @Input() showBalance = 'yes';
  @Input() predefList = [];
  disabled = false;
  isLoading = false;


  onChange = (value: Account) => { };
  onTouched = () => { };

  constructor(
    private popoverCtrl: PopoverController,
    private accountSrv: AccountService,
    private transactionSrv: TransactionService
  ) {

    this.transactionSrv.transferZooBcSubject.subscribe(() => {
      this.loadData();
    });
  }

  async loadData() {
    this.account = await this.accountSrv.getCurrAccount();
    this.isLoading = true;
    this.account = await this.accountSrv.getCurrAccount();
    const sender = this.account.address;
    const accBalance = await zoobc.Account.getBalance(sender);
    this.account.balance = Number(accBalance.spendableBalance);
    this.isLoading = false;
  }

  async ngOnInit() {

    if (this.predefList.length < 1) {
      this.loadData();
    } else {
      this.account = undefined;
    }
  }

  async switchAccount(ev: any) {
    if (this.canSwitch === 'no') {
      return;
    }

    const popover = await this.popoverCtrl.create({
      component: PopoverAccountComponent,
      event: ev,
      cssClass: 'popover-account',
      componentProps: {
        accountType: this.accountType,
        predefList: this.predefList,
        showBalance: this.showBalance
      },
      translucent: true
    });

    popover.onWillDismiss().then(async ({ data }: { data: Account }) => {
      if (data) {
        this.account = data;
        if (this.switchToActive === 'yes') {
          this.accountSrv.switchAccount(data);
        }
        this.onChange(data);
      }
    });

    return popover.present();
  }

  writeValue(value: Account) {
    this.account = value;
  }

  registerOnChange(fn: (value: Account) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  // Allow the Angular form control to disable this input
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}
