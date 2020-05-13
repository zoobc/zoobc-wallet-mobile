import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/Services/language.service';
import { CurrencyService} from 'src/app/Services/currency.service';
import {
  LANGUAGES,
  SELECTED_LANGUAGE,
  CURRENCY_LIST,
  STORAGE_ACTIVE_CURRENCY,
  STORAGE_ACTIVE_NETWORK,
  NETWORK_LIST,
  THEME_OPTIONS,
  STORAGE_ACTIVE_THEME
} from 'src/environments/variable.const';
import { NetworkService } from 'src/app/Services/network.service';
import { getFormatedDate } from 'src/Helpers/converters';
import { TransactionService } from 'src/app/Services/transaction.service';
import { StoragedevService } from 'src/app/Services/storagedev.service';
import { ThemeService } from 'src/app/Services/theme.service';
import { Currency } from 'src/app/Interfaces/currency';

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
  public activeNetwork: string;
  public currencyRateList: any;
  public currencyList = CURRENCY_LIST;
  public networks = NETWORK_LIST;
  public currencyRate: Currency;
  public timestamp: string;
  public themes = THEME_OPTIONS;

  constructor(
    private strgSrv: StoragedevService,
    private transactionService: TransactionService,
    private languageService: LanguageService,
    private networkService: NetworkService,
    private theme: ThemeService,
    private currencyService: CurrencyService) {

      this.currencyService.currencySubject.subscribe((rate: Currency) => {
        this.currencyRate = rate;
      });

    }

  async ngOnInit() {
    this.getCurrencyRates();
    this.currencyRate = this.currencyService.getRate();
    this.activeLanguage = await this.strgSrv.get(SELECTED_LANGUAGE);
    this.activeCurrency = await this.strgSrv.get(STORAGE_ACTIVE_CURRENCY);
    this.activeNetwork = await this.strgSrv.get(STORAGE_ACTIVE_NETWORK);
    this.activeTheme = await this.strgSrv.get(STORAGE_ACTIVE_THEME);
    console.log('---- Active Theme: ', this.activeTheme);

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


  // async setCurrencyRate(currCode: any) {
  //   const rates = this.currencyRateList.rates;
  //   const currencyRate: Currency = {
  //     name: currCode,
  //     value: Number(rates[currCode])
  //   };
  //   this.currencyRate = currencyRate;
  //   this.currencyService.changeRate(currencyRate);
  //   // console.log('== Rates on settings currCode: ', currencyRate);
  // }

  selectActiveLanguage() {
    // console.log('=============== this.activeLanguage', this.activeLanguage);
    this.languageService.setLanguage(this.activeLanguage);
  }

  selectActiveNetwork() {
    // console.log('=============== this.activeNetwork', this.activeNetwork);
    this.transactionService.setRpcUrl(this.activeNetwork);
    this.networkService.setNetwork(this.activeNetwork);
  }

  async changeTheme() {
    console.log('== changeTheme: theme selected: ', this.activeTheme);
    await this.theme.setTheme(this.activeTheme);
  }

}
