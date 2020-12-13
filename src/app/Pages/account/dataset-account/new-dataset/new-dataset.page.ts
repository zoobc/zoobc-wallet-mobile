import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Currency } from 'src/app/Interfaces/currency';
import { AccountService } from 'src/app/Services/account.service';
import { AuthService } from 'src/app/Services/auth-service';
import { CurrencyService } from 'src/app/Services/currency.service';
import { environment } from 'src/environments/environment';
import { COIN_CODE, TRANSACTION_MINIMUM_FEE } from 'src/environments/variable.const';

@Component({
  selector: 'app-new-dataset',
  templateUrl: './new-dataset.page.html',
  styleUrls: ['./new-dataset.page.scss'],
})
export class NewDatasetPage implements OnInit {
  
  subscription: Subscription = new Subscription();
  isSetupOther: boolean;
  isLoading: boolean;
  isError: boolean;
  minFee = TRANSACTION_MINIMUM_FEE;
  currencyRate: Currency;

  formGroup: FormGroup;
  propertyField = new FormControl('', [Validators.required]);
  valueField = new FormControl('', [Validators.required]);
  recipientAddressField = new FormControl('', [Validators.required]);
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);
  feeFormCurr = new FormControl('', Validators.required);
  timeoutField = new FormControl('', [Validators.required, Validators.min(1), Validators.max(720)]);
  typeFeeField = new FormControl(COIN_CODE);

  constructor(
    private currencyServ: CurrencyService,
    private accountService: AccountService,
    private translate: TranslateService
  ) {
    this.formGroup = new FormGroup({
      property: this.propertyField,
      value: this.valueField,
      recipientAddress: this.recipientAddressField,
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      typeFee: this.typeFeeField,
    });
  }

  ngOnInit() {
  }

}
