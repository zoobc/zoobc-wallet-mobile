import { Component, OnInit} from '@angular/core';
import { Account} from 'src/app/Interfaces/account';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Currency } from 'src/app/Interfaces/currency';
import { Subscription } from 'rxjs';
import { TRANSACTION_MINIMUM_FEE } from 'src/environments/variable.const';
import { AccountService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-msig-send-transaction',
  templateUrl: './msig-send-transaction.page.html',
  styleUrls: ['./msig-send-transaction.page.scss'],
})
export class MsigSendTransactionPage implements OnInit {

  subscription: Subscription = new Subscription();

  account: Account;
  formSend: FormGroup;
  minFee = TRANSACTION_MINIMUM_FEE;
  feeForm = new FormControl(this.minFee * 2, [Validators.required, Validators.min(this.minFee)]);
  feeFormCurr = new FormControl('', Validators.required);
  timeoutField = new FormControl('', [Validators.required, Validators.min(1)]);
  amountCurrencyForm = new FormControl('', Validators.required);

  currencyRate: Currency;
  trxFee: string;
  advancedMenu = false;
  constructor(
    private accountSrv: AccountService  ) {
    this.formSend = new FormGroup({
      amountCurrency: this.amountCurrencyForm,
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      timeout: this.timeoutField,
    });
  }

  async ngOnInit() {
    this.account = await this.accountSrv.getCurrAccount();
  }


  switchAccount(account: Account) {
    this.account = account;
  }

}

