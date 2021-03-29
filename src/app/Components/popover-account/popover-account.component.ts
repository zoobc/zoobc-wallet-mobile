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

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Account, AccountType } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
import { AuthService } from 'src/app/Services/auth-service';

@Component({
  selector: 'app-popover-account',
  templateUrl: './popover-account.component.html',
  styleUrls: ['./popover-account.component.scss']
})
export class PopoverAccountComponent implements OnInit {
  accounts: Account[];
  selectedIndex: number;
  predefList = [];
  showBalance = 'yes';
  @Input() accountType: AccountType;
  isLoading = false;
  loginType: number;
  constructor(
    public popoverCtrl: PopoverController,
    private router: Router,
    private accountSrv: AccountService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.loginType = this.authService.loginType;
    this.isLoading = true;
    let accs: Account[];

    if (this.showBalance === 'yes') {
      accs = await this.accountSrv.getAccountsWithBalance();
    } else {
      accs = await this.accountSrv.allAccount();
    }

    if (this.predefList && this.predefList.length > 0) {
      this.isLoading = false;
      this.accounts = accs.filter(acc => {// for every object in heroes
        return this.predefList.includes(acc.address.value);
      });
      return;
    }

    if (this.accountType) {
      this.accounts = accs.filter((account: Account) => {
        return account.type && account.type === this.accountType;
      });
    } else {
      this.accounts = accs;
    }


    const selectedAccount = await this.accountSrv.getCurrAccount();
    this.selectedIndex = this.accounts.findIndex((account: Account) => {
      return account.address === selectedAccount.address;
    });

    this.isLoading = false;
  }


  async selectAccount(account: any) {
    this.popoverCtrl.dismiss(account);
  }

  goToAccount() {
    this.popoverCtrl.dismiss('');
    this.router.navigate(['/list-account']);
  }

  cancel() {
    this.popoverCtrl.dismiss('');
  }

}
