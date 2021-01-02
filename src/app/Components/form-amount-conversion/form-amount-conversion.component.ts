import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CurrencyService } from 'src/app/Services/currency.service';
import { COIN_CODE, CONST_DEFAULT_CURRENCY } from 'src/environments/variable.const';

@Component({
  selector: 'app-form-amount-conversion',
  templateUrl: './form-amount-conversion.component.html',
  styleUrls: ['./form-amount-conversion.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormAmountConversionComponent),
      multi: true
    }
  ]
})
export class FormAmountConversionComponent
  implements OnInit, ControlValueAccessor {

  coinCode = COIN_CODE;
  currencyCode =  CONST_DEFAULT_CURRENCY;
  constructor(private currencySrv: CurrencyService) {}

  conversionAmount = {
    ZBC: 0,
    USD: 0
  };

  ngOnInit() {}

  changeAmount = (currency: string) => {
    const amount = this.conversionAmount[currency];
    if (currency === COIN_CODE) {
      this.conversionAmount.USD = this.currencySrv.convertCurrency(
        amount,
        currency,
        CONST_DEFAULT_CURRENCY
      );
    } else if (currency === CONST_DEFAULT_CURRENCY) {
      this.conversionAmount.ZBC = this.currencySrv.convertCurrency(
        amount,
        currency,
        COIN_CODE
      );
    }

    this.onChange(this.conversionAmount.ZBC);
  }

  onChange = (value: number) => {};

  onTouched = () => {};

  writeValue(value: number) {
    // this.amount = value;
  }

  registerOnChange(fn: (value: number) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
}
