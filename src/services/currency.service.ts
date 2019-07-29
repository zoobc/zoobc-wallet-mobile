import { Injectable } from '@angular/core';
import axios from 'axios';
import { Storage } from '@ionic/storage';
import { RATES, SELECTED_CURRENCY } from 'src/environments/variable.const';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  constructor(private storage: Storage) {}

  async getCurrencyRates() {
    const { data } = await axios.get(
      'https://api.exchangeratesapi.io/latest?base=USD&symbols=USD,IDR'
    );
    await this.storage.set(RATES, data.rates);
  }

  async convertCurrency(price, currency) {
    const rates = await this.storage.get(RATES);

    if (rates[currency.toUpperCase()]) {
      return price * rates[currency.toUpperCase()];
    }
  }

  async setCurrency(currency) {
    await this.storage.set(SELECTED_CURRENCY, currency);
  }
}
