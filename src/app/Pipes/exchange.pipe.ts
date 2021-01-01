import { Pipe, PipeTransform } from '@angular/core';
import { STORAGE_CURRENCY_RATES, STORAGE_ACTIVE_CURRENCY } from 'src/environments/variable.const';
import { StorageService } from 'src/app/Services/storage.service';

@Pipe({
  name: 'exchange'
})
export class ExchangePipe implements PipeTransform {
  private activeCurrency: any;
  private rates: any;

  constructor(private strgSrv: StorageService) {}

  async transform(value: any, args?: any) {
    this.activeCurrency = await this.strgSrv.get(STORAGE_ACTIVE_CURRENCY);
    this.rates = await this.strgSrv.get(STORAGE_CURRENCY_RATES);

    if (this.activeCurrency && this.rates[this.activeCurrency.toUpperCase()]) {
      return value * this.rates[this.activeCurrency.toUpperCase()];
    }
  }
}
