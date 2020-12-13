import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { truncate } from 'src/Helpers/utils';
import { Subscription } from 'rxjs';
import { Currency } from 'src/app/Interfaces/currency';
import { CurrencyRateService } from 'src/app/Services/currency-rate.service';
import { COIN_CODE } from 'src/environments/variable.const';

@Component({
  selector: 'app-input-amount',
  templateUrl: './input-amount.component.html',
  styleUrls: ['./input-amount.component.scss'],
})
export class InputAmountComponent implements OnInit, OnDestroy {

  @Input() label: string;
  @Input() displayConverter = true;
  @Input() group: FormGroup;
  @Input() amountName: string;

  amountCurrency: number;
  typeCoinName = COIN_CODE;
  currencyRate: Currency;
  subsRate: Subscription;

  constructor(private currencyServ: CurrencyRateService) {}

  ngOnInit() {
    this.subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
    });
  }

  ngOnDestroy() {
    if (this.subsRate) { this.subsRate.unsubscribe(); }
  }

  onChangeCoin(value) {
    this.typeCoinName = value;
    const amount = this.group.get(this.amountName).value;
    this.onChangeAmountField(amount);
  }

  onChangeAmountField(value: number) {
    const amount = truncate(value, 8);
    this.amountCurrency = truncate(amount * this.currencyRate.value, 4);
  }

  onChangeAmountCurrencyField(value: any) {
    this.amountCurrency = value;
    const amount = ((value / this.currencyRate.value) * 1e8) / 1e8;
    const amountTrunc = truncate(amount, 8);
    this.group.get(this.amountName).patchValue(amountTrunc);
  }

}
