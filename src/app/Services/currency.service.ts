import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment.prod';
import { CURRENCY_RATE_STORAGE } from 'src/environments/variable.const';

export interface Currency {
  name: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  public currencySubject: Subject<any> = new Subject<any>();
  public currentRate: Currency;
  // private openexchangerates = '7104c503e36947abba35d66d1ee66d35';

  constructor(private http: HttpClient) {

    // get current rate from storage.
    let prevRate = JSON.parse(localStorage.getItem(CURRENCY_RATE_STORAGE));
    if (!prevRate) {
      prevRate = { name: 'USD', value: 1 };
    }
    this.currentRate = prevRate;
  }

  setRate(arg: any){
    this.currentRate = arg;
  }

  getRate() {
    return this.currentRate;
  }

  getCurrencyRateFromThirdParty() {
    return this.http.get(environment.openExchangeUrl + '/latest.json?app_id=7104c503e36947abba35d66d1ee66d35');
  }

  getCurrencyListFromThirdParty() {
    return this.http.get(environment.openExchangeUrl + '/currencies.json');
  }

  changeRate(arg: Currency) {
    // set current rate to arg
    this.setRate(arg);
    // broadcast to subsriber
    this.currencySubject.next(this.getRate());
    // set to local storage
    localStorage.setItem(CURRENCY_RATE_STORAGE, JSON.stringify(this.getRate()));
  }
}
