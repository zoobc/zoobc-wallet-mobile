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
      this.accountService.fetchAccountsBalance();
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
