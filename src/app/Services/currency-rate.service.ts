import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Currency } from '../Interfaces/currency';
import { CONST_DEFAULT_CURRENCY } from 'src/environments/variable.const';

@Injectable({
  providedIn: 'root',
})
export class CurrencyRateService {
  private defaultRate: Currency = { name: CONST_DEFAULT_CURRENCY, value: 0 };
  private sourceRate = new BehaviorSubject(this.defaultRate);
  rate: Observable<Currency> = this.sourceRate.asObservable();

  zbcPriceInUsd = 1;

  constructor(private http: HttpClient) {
    const rate = JSON.parse(localStorage.getItem('RATE')) || this.defaultRate;
    this.sourceRate.next(rate);
  }

  getRate(): Promise<Currency> {
    const currencyName = this.sourceRate.getValue().name;
    const url = `https://api.exchangeratesapi.io/latest?base=USD&symbols=${currencyName}`;
    return new Promise((resolve, reject) => {
      this.http
        .get(url)
        .toPromise()
        .then((res: any) => {
          const rate: Currency = {
            name: currencyName,
            value: res.rates[currencyName] * this.zbcPriceInUsd,
          };

          this.updateRate(rate);
          resolve(rate);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  getRates(): Promise<Currency[]> {
    const url = 'https://api.exchangeratesapi.io/latest?base=USD&symbols=USD';
    return new Promise((resolve, reject) => {
      this.http
        .get(url)
        .toPromise()
        .then((res: any) => {
          const rates = Object.keys(res.rates).map(currencyName => {
            const rate = {
              name: currencyName,
              value: res.rates[currencyName] * this.zbcPriceInUsd,
            };
            if (this.sourceRate.getValue().name === currencyName) { this.updateRate(rate); }
            return rate;
          });
          rates.sort((a, b) => {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
          });
          resolve(rates);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  updateRate(rate: Currency) {
    this.sourceRate.next(rate);
    localStorage.setItem('RATE', JSON.stringify(rate));
  }
}