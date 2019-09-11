import { Injectable } from "@angular/core";
import axios from "axios";
import { Storage } from "@ionic/storage";
import { RATES, SELECTED_CURRENCY } from "src/environments/variable.const";

@Injectable({
  providedIn: "root"
})
export class CurrencyService {
  _rates = {
    ZBC: 1,
    USD: 3,
    IDR: 42135
  };

  constructor(private storage: Storage) {}

  async getCurrencyRates() {
    const { data } = await axios.get(
      "https://api.exchangeratesapi.io/latest?base=USD&symbols=USD,IDR"
    );
    await this.storage.set(RATES, data.rates);
  }

  convertCurrency(price, currFrom, currTo) {
    if (currFrom === currTo) {
      return price * 1;
    } else {
      const currFromVal = this._rates[currFrom];
      const currToVal = this._rates[currTo];

      return (currToVal / currFromVal) * price;
    }
  }

  async setCurrency(currency) {
    await this.storage.set(SELECTED_CURRENCY, currency);
  }
}
