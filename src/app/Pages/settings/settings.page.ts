import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/Services/language.service';
import { CurrencyService} from 'src/app/Services/currency.service';
import {
  LANGUAGES,
  SELECTED_LANGUAGE,
  CURRENCY_LIST,
  STORAGE_ACTIVE_CURRENCY,
  STORAGE_ACTIVE_NETWORK_IDX,
  NETWORK_LIST,
  THEME_OPTIONS,
  STORAGE_ACTIVE_THEME
} from 'src/environments/variable.const';
import { NetworkService } from 'src/app/Services/network.service';
import { getFormatedDate } from 'src/Helpers/converters';
import { StoragedevService } from 'src/app/Services/storagedev.service';
import { ThemeService } from 'src/app/Services/theme.service';
import { Currency } from 'src/app/Interfaces/currency';
import { ModalController } from '@ionic/angular';
import { PopupCurrencyPage } from './popup-currency/popup-currency.page';
import { PopupLanguagesPage } from './popup-languages/popup-languages.page';
import { AuthService } from 'src/app/Services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public Object = Object;
  public languages = LANGUAGES;
  public activeLanguage = 'en';
  public activeTheme: string;
  public activeCurrency: string;
  public activeNetwork: any;
  public currencyRateList: any;
  public currencyList = CURRENCY_LIST;
  public networks = NETWORK_LIST;
  public currencyRate: Currency;
  public timestamp: string;
  public themes = THEME_OPTIONS;
  indexSelected: any;
  activeCureencyWithname: string;
  activeLanguageWithname: string;

  constructor(
    private strgSrv: StoragedevService,
    private languageService: LanguageService,
    private networkService: NetworkService,
    private theme: ThemeService,
    private modalController: ModalController,
    private currencyService: CurrencyService,
    private authService: AuthService,
    private router: Router) {

      this.currencyService.currencySubject.subscribe((rate: Currency) => {
        this.currencyRate = rate;
      });

    }

  async ngOnInit() {
    this.getCurrencyRates();
    this.currencyRate = this.currencyService.getRate();

    this.activeLanguage = await this.strgSrv.get(SELECTED_LANGUAGE);
    const lang = this.getLanguages(this.activeLanguage);
    this.activeLanguageWithname = lang.code + ' - ' + lang.country;

    this.activeCurrency = await this.strgSrv.get(STORAGE_ACTIVE_CURRENCY);
    this.activeCureencyWithname = this.activeCurrency + ' - ' + this.currencyList[this.activeCurrency];

    this.activeNetwork = await this.strgSrv.get(STORAGE_ACTIVE_NETWORK_IDX);
    this.activeTheme = await this.strgSrv.get(STORAGE_ACTIVE_THEME);
  }

  getLanguages(code: string) {
    return this.languages.find(e => e.code === code);
  }

  async getCurrencyRates() {
    this.currencyRateList = await this.currencyService.getCurrencyRateList();
    if (this.currencyRateList) {
      this.timestamp = getFormatedDate(this.currencyRateList.timestamp);
    }
  }

  async changeRate() {
    await this.currencyService.setActiveCurrency(this.activeCurrency);
  }

  selectActiveLanguage() {
    this.languageService.setLanguage(this.activeLanguage);
  }

  selectActiveNetwork() {
    this.networkService.setNetwork(this.activeNetwork);
  }

  async changeTheme() {
    await this.theme.setTheme(this.activeTheme);
  }

  async showPopupCurrency() {
    const modal = await this.modalController.create({
      component: PopupCurrencyPage,
      componentProps: {
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        const curr = dataReturned.data;
        this.activeCurrency = curr.code;
        this.activeCureencyWithname = curr.code + ' - ' + curr.name;
        this.changeRate();
      }
    });

    return await modal.present();
  }

  async showPopupLanguage() {
    const modal = await this.modalController.create({
      component: PopupLanguagesPage,
      componentProps: {
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        const lang = dataReturned.data;
        this.activeLanguage = lang.code;
        this.activeLanguageWithname = lang.code + ' - ' + lang.country;
        this.selectActiveLanguage();
      }
    });

    return await modal.present();
  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
