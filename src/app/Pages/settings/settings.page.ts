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
import { LanguageService } from 'src/app/Services/language.service';
import { CurrencyService, ICurrency } from 'src/app/Services/currency.service';
import {
  LANGUAGES,
  SELECTED_LANGUAGE,
  CURRENCY_LIST,
  STORAGE_ACTIVE_CURRENCY,
  STORAGE_ACTIVE_NETWORK_GROUP,
  NETWORK_LIST,
  THEME_OPTIONS,
  STORAGE_ACTIVE_THEME
} from 'src/environments/variable.const';
import { NetworkService } from 'src/app/Services/network.service';
import { getFormatedDate } from 'src/Helpers/converters';
import { StorageService } from 'src/app/Services/storage.service';
import { ThemeService } from 'src/app/Services/theme.service';
import { Currency } from 'src/app/Interfaces/currency';
import { AuthService } from 'src/app/Services/auth-service';
import { Router } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { GroupData } from 'zbc-sdk';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public Object = Object;
  public languages = LANGUAGES;
  public activeLanguage: any | null;
  public activeTheme: string;
  public activeCurrency: any;
  public activeNetwork: string;
  public activeNetworkGroup: GroupData[] = [];
  public currencyRateList: any;
  public currencyList = CURRENCY_LIST;
  public networks = NETWORK_LIST;
  public currencyRate: Currency;
  public timestamp: string;
  public themes = THEME_OPTIONS;
  private selectThemeSubscription = null;
  private selectNetworkSubscription = null;
  private selectLanguageSubscription = null;
  private selectCurrencySubscription = null;

  constructor(
    private strgSrv: StorageService,
    private languageService: LanguageService,
    private networkService: NetworkService,
    private themeSrv: ThemeService,
    private currencyService: CurrencyService,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private translateSrv: TranslateService,
    private popoverCtrl: PopoverController
  ) {
    this.currencyService.currencySubject.subscribe((rate: Currency) => {
      this.currencyRate = rate;
    });

  }

  private textConfirmLogout: string;
  private textYes: string;
  private textCancel: string;

  async ngOnInit() {

    const activeLanguageCode = await this.strgSrv.get(SELECTED_LANGUAGE);
    this.activeLanguage = this.languageService.getOne(activeLanguageCode ? activeLanguageCode : 'en');

    const activeCurrencyCode = await this.strgSrv.get(STORAGE_ACTIVE_CURRENCY);
    this.activeCurrency = this.currencyService.getOne(activeCurrencyCode);

    const group: GroupData = await this.strgSrv.get(STORAGE_ACTIVE_NETWORK_GROUP);

    this.activeNetworkGroup[0] = group;

    this.activeNetwork = group.label;

    this.translateSrv.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateLang();
    });

    this.translateLang();
  }

  goToAccount() {
    this.popoverCtrl.dismiss('');
    this.router.navigate(['/list-account']);
  }

  translateLang() {
    this.translateSrv.get([
      'are you sure want to logout?',
      'logout',
      'cancel',
    ]).subscribe((res: any) => {
      this.textConfirmLogout = res['are you sure want to logout?'];
      this.textYes = res.logout;
      this.textCancel = res.cancel;
    });
  }



  ionViewWillEnter() {

    this.selectNetworkSubscription = this.networkService.changeNodeSubject.subscribe((network: any) => {
      this.activeNetwork = network.label;
    });

    this.selectLanguageSubscription = this.languageService.selectLanguageSubject.subscribe((language: any) => {
      this.activeLanguage = language;
    });


  }

  ionViewWillLeave() {
    if (this.selectThemeSubscription) {
      this.selectThemeSubscription.unsubscribe();
    }

    if (this.selectNetworkSubscription) {
      this.selectNetworkSubscription.unsubscribe();
    }

    if (this.selectLanguageSubscription) {
      this.selectLanguageSubscription.unsubscribe();
    }

    if (this.selectCurrencySubscription) {
      this.selectCurrencySubscription.unsubscribe();
    }
  }

  async getCurrencyRates() {
    this.currencyRateList = await this.currencyService.getCurrencyRateList();
    if (this.currencyRateList) {
      this.timestamp = getFormatedDate(this.currencyRateList.timestamp);
    }
  }


  goToTheme() {
    this.router.navigateByUrl('/theme');
  }

  goToNetwork() {
    this.router.navigateByUrl('/network');
  }

  goToCurrency() {
    this.router.navigateByUrl('/popup-currency');
  }

  goToLanguage() {
    this.router.navigateByUrl('/popup-languages');
  }

  goToSeedPhrase() {
    this.router.navigateByUrl('/backup-phrase');
  }

  goToBackupRestoreAddress() {
    this.router.navigateByUrl('/backuprestore-address');
  }

  goToHelpAndSupport() {
    this.router.navigateByUrl('/help');
  }

  goToFeedback() {
    this.router.navigateByUrl('/feedback');
  }

  goToAbout() {
    this.router.navigateByUrl('/about');
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      message: this.textConfirmLogout,
      buttons: [
        {
          text: this.textCancel,
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: this.textYes,
          handler: () => {
            this.authService.logout();
            this.router.navigateByUrl('/');
          }
        }
      ]
    });

    await alert.present();
  }
}
