import { Pipe, PipeTransform } from "@angular/core";
import { CurrencyService } from "src/app/Services/currency.service";
import { map } from "rxjs/operators";

@Pipe({
  name: "activeCurrencyRate$"
})
export class ActiveCurrencyRatePipe implements PipeTransform {
  constructor(private currencySrv: CurrencyService) {}

  transform(value: any, args?: any): any {
    return this.currencySrv.activeCurrencySubject.pipe(
      map(currency => {
        const convertedValue = this.currencySrv.convertCurrency(
          value,
          "ZBC",
          currency
        );
        return (
          convertedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
          " " +
          currency
        );
      })
    );
  }
}
