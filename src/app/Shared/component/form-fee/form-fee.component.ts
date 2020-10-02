import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TransactionService } from 'src/app/Services/transaction.service';
import {
  COIN_CODE,
  TRANSACTION_MINIMUM_FEE
} from 'src/environments/variable.const';

@Component({
  selector: 'app-form-fee',
  templateUrl: './form-fee.component.html',
  styleUrls: ['./form-fee.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFeeComponent),
      multi: true
    }
  ]
})
export class FormFeeComponent implements OnInit, ControlValueAccessor {
  constructor(private transactionSrv: TransactionService) {}

  optionFee: string;
  textFee: number;
  primaryCurr = COIN_CODE;
  secondaryCurr: string;
  fees = this.transactionSrv.transactionFees(TRANSACTION_MINIMUM_FEE);

  ngOnInit() {
    this.textFee = 0;
    this.optionFee = this.fees[0].fee.toString();
  }

  public fee: number;

  changeOptionFee() {
    if (this.optionFee !== 'custom') {
      this.onChange(Number(this.optionFee));
    } else {
      this.onChange(Number(this.textFee));
    }
  }

  changeTextFee() {
    this.onChange(Number(this.textFee));
  }

  onChange = (value: number) => {};

  onTouched = () => {};

  writeValue(value: number) {
    this.fee = value;
  }

  registerOnChange(fn: (value: number) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
}
