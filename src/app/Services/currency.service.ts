import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { currencyRates } from "src/app/app.config";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CurrencyService {
  _rates = currencyRates;

  activeCurrencySubject: BehaviorSubject<any>;

  constructor(private storage: Storage) {
    this.activeCurrencySubject = new BehaviorSubject("USD");
  }

  convertCurrency(price: number, currFrom: string, currTo: string) {
    if (currFrom === currTo) {
      return price * 1;
    } else {
      const currFromVal = this._rates[currFrom];
      const currToVal = this._rates[currTo];

      return (currToVal / currFromVal) * price;
    }
  }

  async setActiveCurrency(currency: string) {
    await this.storage.set("selected_currency", currency);
    this.activeCurrencySubject.next(currency);
  }
}
