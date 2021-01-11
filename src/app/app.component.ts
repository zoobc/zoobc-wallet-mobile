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


import { Component, OnInit } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {
  STORAGE_ACTIVE_CURRENCY,
  CONST_DEFAULT_CURRENCY,
  STORAGE_ACTIVE_THEME,
  CURRENCY_RATE_LIST,
  DEFAULT_THEME
} from 'src/environments/variable.const';

import { Account } from 'src/app/Interfaces/account';
import { NetworkService } from './Services/network.service';
import { StorageService } from './Services/storage.service';
import { LanguageService } from 'src/app/Services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyService } from 'src/app/Services/currency.service';
import { ThemeService } from './Services/theme.service';
import { AccountService } from './Services/account.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  public currentAccount: Account;
  private connectionText = '';


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private languageService: LanguageService,
    private networkService: NetworkService,
    private toastController: ToastController,
    private strgSrv: StorageService,
    private translateService: TranslateService,
    private currencyService: CurrencyService,
    private accountService: AccountService,
    private themeService: ThemeService
  ) {
    this.initializeApp();
    // this.darkMode();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.languageService.setInitialAppLanguage();
      this.networkService.setInitialNetwork();
      this.currencyService.setCurrencyRateList(CURRENCY_RATE_LIST);
      this.setDefaultCurrency();
      // this.accountService.fetchAccountsBalance();
      this.splashScreen.hide();
      this.setTheme();
    });
  }

  async setDefaultCurrency() {
    const curr = await this.strgSrv.get(STORAGE_ACTIVE_CURRENCY);
    if (curr === null) {
      await this.strgSrv.set(STORAGE_ACTIVE_CURRENCY, CONST_DEFAULT_CURRENCY);
    }
  }

  async setTheme() {
    const activeTheme = await this.strgSrv.get(STORAGE_ACTIVE_THEME);
    if (!activeTheme || activeTheme === undefined) {
      await this.themeService.setTheme(DEFAULT_THEME);
    }
  }

  async presentNotificationToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500
    });
    toast.present();
  }

  async presentNoConnectionToast() {
    const toast = await this.toastController.create({
      message: this.connectionText,
      duration: 3000
    });
    toast.present();
  }

  ngOnInit() {
    /*this.network.onDisconnect().subscribe(() => {
      this.presentNoConnectionToast();
    });*/

    this.translateService
      .get('Please check internet connection')
      .subscribe((res: string) => {
        this.connectionText = res;
      });
  }
}
