import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
// import { Currency, CurrencyRateService } from 'src/app/services/currency-rate.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Services/auth-service';
import { Account } from 'src/app/Interfaces/account';
import { truncate } from 'src/helpers/utils';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TRANSACTION_MINIMUM_FEE } from 'src/environments/variable.const';
import { Currency } from 'src/app/Interfaces/currency';

@Component({
  selector: 'app-msig-create-transaction',
  templateUrl: './msig-create-transaction.page.html',
  styleUrls: ['./msig-create-transaction.page.scss'],
})
export class MsigCreateTransactionPage implements OnInit, OnDestroy {

  minFee = TRANSACTION_MINIMUM_FEE;
  currencyRate: Currency;
  kindFee: string;
  subscription: Subscription = new Subscription();
  account: Account;

  isCompleted = true;
  createTransactionForm: FormGroup;
  recipientForm = new FormControl('', Validators.required);
  amountForm = new FormControl('', [Validators.required, Validators.min(1 / 1e8)]);
  amountCurrencyForm = new FormControl('', Validators.required);
  feeForm = new FormControl(this.minFee * 2, [Validators.required, Validators.min(this.minFee)]);
  feeFormCurr = new FormControl('', Validators.required);
  timeoutField = new FormControl('');
  typeCoinField = new FormControl('ZBC');

  multisig: MultiSigDraft;
  multisigSubs: Subscription;
  multiSigDrafts: MultiSigDraft[];

  feeSlow = environment.fee;
  feeMedium = this.feeSlow * 2;
  feeFast = this.feeMedium * 2;
  typeFee: number;
  customFeeValues: number;

  stepper = {
    multisigInfo: false,
    signatures: false,
  };

  constructor(
    private authServ: AuthService,
    // private currencyServ: CurrencyRateService,
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location
  ) {
    this.createTransactionForm = new FormGroup({
      recipient: this.recipientForm,
      amount: this.amountForm,
      amountCurrency: this.amountCurrencyForm,
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      timeout: this.timeoutField,
      typeCoin: this.typeCoinField,
    });
  }

  ngOnInit() {
    this.account = this.authServ.getCurrAccount();
    // Currency Subscriptions
    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;

      const minCurrency = truncate(this.minFee * rate.value, 8);

      this.feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
      this.amountCurrencyForm.setValidators([Validators.required, Validators.min(minCurrency)]);
    });
    this.subscription.add(subsRate);
    // Multisignature Subscription
    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      const { multisigInfo, unisgnedTransactions, signaturesInfo } = multisig;
      if (unisgnedTransactions === undefined) { this.router.navigate(['/multisignature']); }

      this.multisig = multisig;

      if (unisgnedTransactions) {
        const { sender, recipient, amount, fee } = unisgnedTransactions;
        this.account.address = sender;
        this.recipientForm.setValue(recipient);
        this.amountForm.setValue(amount);
        this.amountCurrencyForm.setValue(amount * this.currencyRate.value);
        this.feeForm.setValue(fee);
        this.feeFormCurr.setValue(fee * this.currencyRate.value);
        this.timeoutField.setValue('0');
        if (fee === this.feeSlow) {
          this.typeFee = 1;
        } else if (fee === this.feeMedium) {
          this.typeFee = 2;
        } else if (fee === this.feeFast) {
          this.typeFee = 3;
        } else {
          this.customFeeValues = fee;
        }
      }

      this.stepper.multisigInfo = multisigInfo !== undefined ? true : false;
      this.stepper.signatures = signaturesInfo !== undefined ? true : false;
    });
    this.getMultiSigDraft();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.multisigSubs.unsubscribe();
  }

  onClickFeeChoose(value) {
    this.kindFee = value;
  }

  onSwitchAccount(account: Account) {
    this.account = account;
  }

  getMultiSigDraft() {
    this.multiSigDrafts = this.multisigServ.getDrafts();
  }

  next() {
    if (this.createTransactionForm.valid) {
      this.updateCreateTransaction();
      const { signaturesInfo } = this.multisig;
      if (signaturesInfo !== undefined) {
        this.router.navigate(['/multisignature/add-signatures']);
      } else {
        this.router.navigate(['/multisignature/send-transaction']);
      }
    }
  }

  saveDraft() {
    this.updateCreateTransaction();
    const isDraft = this.multiSigDrafts.some(draft => draft.id === this.multisig.id);
    if (isDraft) {
      this.multisigServ.editDraft();
    } else {
      this.multisigServ.saveDraft();
    }
    this.router.navigate(['/multisignature']);
  }

  updateCreateTransaction() {
    const { recipient, amount, fee } = this.createTransactionForm.value;
    const multisig = { ...this.multisig };
    const address = this.multisig.generatedSender || this.account.address;

    multisig.unisgnedTransactions = {
      sender: address,
      amount,
      fee,
      recipient,
    };
    this.multisigServ.update(multisig);
  }

  back() {
    this.location.back();
  }
}
