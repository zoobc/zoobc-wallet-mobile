import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CurrencyService } from 'src/app/Services/currency.service';
import { COIN_CODE, CONST_DEFAULT_CURRENCY } from 'src/environments/variable.const';

enum OtherCurrencyDecoration {
  BRACKET,
  NONE
}
@Component({
  selector: 'app-info-amount-conversion',
  templateUrl: './info-amount-conversion.component.html',
  styleUrls: ['./info-amount-conversion.component.scss']
})
export class InfoAmountConversionComponent implements OnInit, OnChanges {
  @Input() value: number;
  @Input() otherCurrency: string;
  @Input() otherCurrencyDecoration: OtherCurrencyDecoration;
  @Input() prefix: string;

  public otherValue: number;

  constructor(private currencySrv: CurrencyService) { }

  setOtherValue() {
    this.otherValue = this.currencySrv.convertCurrency(
      this.value,
      COIN_CODE,
      CONST_DEFAULT_CURRENCY
    );
  }

  ngOnInit() {
    this.setOtherValue();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this.setOtherValue();
    }
  }
}
