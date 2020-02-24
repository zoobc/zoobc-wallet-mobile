import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment.prod';
import { CURRENCY_RATE_STORAGE, OPENEXCHANGE_RATES_STORAGE, ACTIVE_CURRENCY, CURRENCY_LIST } from 'src/environments/variable.const';

export interface Currency {
  name: string;
  value: number;
}

export interface CurrencyName {
  name: string;
  desc: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  public currencySubject: Subject<any> = new Subject<any>();
  public currentRate: Currency;
  public activeCurrency: string;
  public currencyRateList: any;
  public priceInUSD = environment.zbcPriceInUSD;
  // private openexchangerates = '7104c503e36947abba35d66d1ee66d35';

  constructor(private http: HttpClient, private storage: Storage) {
    // get current rate from storage.
    let prevRate = JSON.parse(localStorage.getItem(CURRENCY_RATE_STORAGE));
    if (!prevRate) {
      prevRate = { name: 'USD', value: 1 };
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

  setActiveCurrency(arg: string) {
    this.storage.set(ACTIVE_CURRENCY, arg);
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
     localStorage.setItem(CURRENCY_RATE_STORAGE, JSON.stringify(this.getRate()));  
  }

}
