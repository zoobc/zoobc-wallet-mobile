import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CurrencyService } from 'src/app/Services/currency.service';

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
      'ZBC',
      'USD'
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
