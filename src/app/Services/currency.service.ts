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
