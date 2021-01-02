import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { STORAGE_CURRENCY_RATE, STORAGE_ACTIVE_CURRENCY,
  CURRENCY_LIST, CONST_DEFAULT_RATE, CONST_DEFAULT_CURRENCY } from 'src/environments/variable.const';
import { StorageService } from './storage.service';
import { Currency } from '../Interfaces/currency';

export interface ICurrency {
  name: string;
  code: string;
}

const currencies: ICurrency[] = [
  {
    name: 'United States Dollars',
    code: CONST_DEFAULT_CURRENCY
  },
];

export const currencyRates = {
  ZBC: 1, // ZBC is always 1
  USD: 1,
};


@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  public currencySubject: Subject<any> = new Subject<any>();
  public selectCurrencySubject: Subject<ICurrency> = new Subject<ICurrency>();
  public currentRate: Currency;
  public activeCurrency: string;
  public currencyRateList: any;
  public priceInUSD = environment.zbcPriceInUSD;
  // private openexchangerates = '7104c503e36947abba35d66d1ee66d35';

  constructor(private http: HttpClient, private strgSrv: StorageService) {
   this.loadRate();
  }

  public currencies = CURRENCY_LIST;

  getOne(currencyCode: string) {
    const currencyName = this.currencies[currencyCode.toLocaleUpperCase()];
    return {
      code: currencyCode,
      name: currencyName
    };
  }

  async loadRate() {
     let prevRate = await this.strgSrv.get(STORAGE_CURRENCY_RATE);
     if (prevRate === null) {
       prevRate = CONST_DEFAULT_RATE;
     }
     this.currentRate = prevRate;
  }

  setCurrencyRateList(arg: any) {
    this.currencyRateList = arg;
  }

  getCurrencyRateList() {
    return this.currencyRateList;
  }

  getPriceInUSD() {
    return this.priceInUSD;
  }

  setPriceInUSD(arg) {
    this.priceInUSD = arg;
  }

  setRate(arg: any) {
    this.currentRate = arg;
  }

  getRate() {
    return this.currentRate;
  }

  // getCurrencyRateFromThirdParty() {
  //   return this.http.get(environment.openExchangeUrl + '/latest.json?app_id=9b91b62c0ab74507b66aa90b686df476');
  // }

  async setActiveCurrency(arg: string) {
    await this.strgSrv.set(STORAGE_ACTIVE_CURRENCY, arg);
    this.activeCurrency = arg;
    const currencyRate: Currency = {
      name: arg,
      value: Number(this.currencyRateList.rates[arg])
    };

     // set current rate to arg
    this.setRate(currencyRate);
     // broadcast to subsriber
    this.currencySubject.next(this.getRate());
     // set to local storage
    await this.strgSrv.set(STORAGE_CURRENCY_RATE, this.getRate());
  }

  broadcastSelectCurrency(currency: ICurrency) {
    this.selectCurrencySubject.next(currency);
  }

  convertCurrency(price: number, currFrom: string, currTo: string) {
    if (currFrom === currTo) {
      return price * 1;
    } else {
      const currFromVal = currencyRates[currFrom];
      const currToVal = currencyRates[currTo];

      return (currToVal / currFromVal) * price;
    }
  }
}
