import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { currencyRates } from "src/app/app.config";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CurrencyService {
  _rates = currencyRates;

  _activeCurrency = "";

  activeCurrencySubject: BehaviorSubject<any>;

  defaultCurrency = "USD";

  constructor(private storage: Storage) {
    this.activeCurrencySubject = new BehaviorSubject(this.defaultCurrency);
    this._activeCurrency = this.defaultCurrency;
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

  set activeCurrency(value) {
    this.storage.set("selected_currency", value).then(() => {
      this._activeCurrency = value;
      this.activeCurrencySubject.next(value);
    });
  }

  get activeCurrency() {
    return this._activeCurrency;
  }
}
