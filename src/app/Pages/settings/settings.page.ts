import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/Services/language.service';
import { CurrencyService, Currency, CurrencyName } from 'src/app/Services/currency.service';
import { Storage } from '@ionic/storage';
import {
  LANGUAGES,
  SELECTED_LANGUAGE,
  CURRENCY_LIST,
  ACTIVE_CURRENCY,
  ACTIVE_NETWORK,
  NETWORK_LIST
} from 'src/environments/variable.const';
import { NetworkService } from 'src/app/Services/network.service';
import { getFormatedDate } from 'src/app/Helpers/converters';
import { TransactionService } from 'src/app/Services/transaction.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public Object = Object;
  public languages = LANGUAGES;
  public activeLanguage = 'en';
  public activeCurrency: string;
  public activeNetwork: string;
  public currencyRateList: any;
  public currencyList = CURRENCY_LIST;
  public networks = NETWORK_LIST;
  public currencyRate: Currency;
  public timestamp: string;

  constructor(
    private storage: Storage,
    private transactionService: TransactionService,
    private languageService: LanguageService,
    private networkService: NetworkService,
    private currencyService: CurrencyService) { 

       // if currency changed
      this.currencyService.currencySubject.subscribe((rate: Currency) => {
        this.currencyRate = rate;
      });

    }

  async ngOnInit() {
    this.getCurrencyRates();
    this.currencyRate = this.currencyService.getRate();
    this.activeLanguage = await this.storage.get(SELECTED_LANGUAGE);
    this.activeCurrency = await this.storage.get(ACTIVE_CURRENCY);
    this.activeNetwork = await this.storage.get(ACTIVE_NETWORK);    
    console.log('============= activeNetwork ONLOAD:', this.activeNetwork);
  }


  async getCurrencyRates() {
    this.currencyRateList = await this.currencyService.getCurrencyRateList();
    if (this.currencyRateList){
      this.timestamp = getFormatedDate(this.currencyRateList.timestamp);
    }
  }

  changeRate() {
    console.log('============= activeCurrency:', this.activeCurrency);
    this.currencyService.setActiveCurrency(this.activeCurrency);
    // this.setCurrencyRate(this.activeCurrency);
    console.log('== Rates on settings currCode 2: ', this.currencyRate);
    console.log('============= activeCurrency 2:', this.activeCurrency);
  }

  
  // async setCurrencyRate(currCode: any) {
  //   const rates = this.currencyRateList.rates;
  //   const currencyRate: Currency = {
  //     name: currCode,
  //     value: Number(rates[currCode])
  //   };
  //   this.currencyRate = currencyRate;
  //   this.currencyService.changeRate(currencyRate);
  //   console.log('== Rates on settings currCode: ', currencyRate);
  // }

  selectActiveLanguage() {
    console.log('=============== this.activeLanguage', this.activeLanguage);
    this.languageService.setLanguage(this.activeLanguage);
  }

  switchNetwork(host: string) {
   
     console.log('Set new host: ', host);
  }


  selectActiveNetwork() {
    console.log('=============== this.activeNetwork', this.activeNetwork);
    this.transactionService.setRpcUrl(this.activeNetwork);
    this.networkService.setNetwork(this.activeNetwork);
  }

}
