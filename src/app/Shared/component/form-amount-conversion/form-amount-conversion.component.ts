import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CurrencyService } from 'src/app/Services/currency.service';

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
  constructor(private currencySrv: CurrencyService) {}

  conversionAmount = {
    ZBC: 0,
    USD: 0
  };

  ngOnInit() {}

  /*switchCurrency() {
    const first = this.primaryCurr.slice();
    if (first === COIN_CODE) {
      this.primaryCurr = this.currencyRate.name;
      this.secondaryCurr = COIN_CODE;
    } else {
      this.primaryCurr = COIN_CODE;
      this.secondaryCurr = this.currencyRate.name;
    }

    this.onAmountChange();
    this.onFeeChange();
  }*/

  changeAmount = (currency: string) => {
    const _amount = this.conversionAmount[currency];
    console.log('__currency', currency);

    if (currency === 'ZBC') {
      this.conversionAmount.USD = this.currencySrv.convertCurrency(
        _amount,
        currency,
        'USD'
      );
    } else if (currency === 'USD') {
      this.conversionAmount.ZBC = this.currencySrv.convertCurrency(
        _amount,
        currency,
        'ZBC'
      );
    }

    this.onChange(this.conversionAmount.ZBC);
  };

  onChange = (value: number) => {};

  onTouched = () => {};

  writeValue(value: number) {
    //this.amount = value;
  }

  registerOnChange(fn: (value: number) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
}
