import { Pipe, PipeTransform } from '@angular/core';
import { Storage } from '@ionic/storage';
import { RATES, ACTIVE_CURRENCY } from 'src/environments/variable.const';

@Pipe({
  name: 'exchange'
})
export class ExchangePipe implements PipeTransform {
  private activeCurrency;
  private rates;

  constructor(private storage: Storage) {}

  async transform(value: any, args?: any) {
    this.activeCurrency = await this.storage.get(ACTIVE_CURRENCY);
    this.rates = await this.storage.get(RATES);

    if (this.activeCurrency && this.rates[this.activeCurrency.toUpperCase()]) {
      return value * this.rates[this.activeCurrency.toUpperCase()];
    }
  }
}