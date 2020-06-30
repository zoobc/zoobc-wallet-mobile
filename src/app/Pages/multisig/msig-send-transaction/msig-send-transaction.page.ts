
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TRANSACTION_MINIMUM_FEE } from 'src/environments/variable.const';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Interfaces/account';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { truncate } from 'src/Helpers/utils';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MultisigService } from 'src/app/Services/multisig.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import zoobc, { MultiSigInterface } from 'zoobc-sdk';
import { Currency } from 'src/app/Interfaces/currency';
import { AuthService } from 'src/app/Services/auth-service';
import { AlertController } from '@ionic/angular';
import { CurrencyService } from 'src/app/Services/currency.service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { UtilService } from 'src/app/Services/util.service';


@Component({
  selector: 'app-msig-send-transaction',
  templateUrl: './msig-send-transaction.page.html',
  styleUrls: ['./msig-send-transaction.page.scss'],
})
export class MsigSendTransactionPage implements OnInit, OnDestroy {

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


  kindFee: string;
  multisig: MultiSigDraft;
  multisigSubs: Subscription;
  multiSigDrafts: MultiSigDraft[];

  feeSlow = TRANSACTION_MINIMUM_FEE;
  feeMedium = this.feeSlow * 2;
  feeFast = this.feeMedium * 2;
  typeFee: number;
  customFeeValues: number;

  constructor(
    private utilService: UtilService,
    private alertController: AlertController,
    private router: Router,
    private multisigServ: MultisigService,
    private location: Location
  ) {
    this.formSend = new FormGroup({
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      timeout: this.timeoutField,
    });
  }

  switchAccount(account: Account) {
    this.account = account;
  }

  ngOnInit() {
    // this.accountSrv.getCurrAccount().then(acc => {
    //   this.account = acc;
    // });
    // const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
    //   this.currencyRate = rate;
    //   const minCurrency = truncate(this.minFee * rate.value, 8);
    //   this.feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
    // });
    // this.subscription.add(subsRate);

    // this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
    //   this.multisig = multisig;

    //   const { accountAddress, fee } = this.multisig;
    //   this.account.address = accountAddress;
    //   this.feeForm.setValue(multisig.fee);
    //   this.feeFormCurr.setValue(multisig.fee * this.currencyRate.value);
    //   this.timeoutField.setValue('0');
    //   if (fee === this.feeSlow) {
    //     this.typeFee = 1;
    //     this.kindFee = 'Slow';
    //   } else if (fee === this.feeMedium) {
    //     this.typeFee = 2;
    //     this.kindFee = 'Average';
    //   } else if (fee === this.feeFast) {
    //     this.typeFee = 3;
    //     this.kindFee = 'Fast';
    //   } else {
    //     this.customFeeValues = multisig.fee;
    //     this.kindFee = 'Custom';
    //   }
    // });
    // this.getMultiSigDraft();
  }

  async getMultiSigDraft() {
    this.multiSigDrafts = await this.multisigServ.getDrafts();
  }

  saveDraft() {
    this.updateSendTransaction();
    const isDraft = this.multiSigDrafts.some(draft => draft.id === this.multisig.id);
    if (isDraft) {
      this.multisigServ.editDraft();
    } else {
      this.multisigServ.saveDraft();
    }
    this.router.navigate(['/multisignature']);
  }

  updateSendTransaction() {
    const { fee } = this.formSend.value;
    const multisig = { ...this.multisig };
    multisig.accountAddress = this.account.address;
    multisig.fee = fee;
    this.multisigServ.update(multisig);
  }

  back() {
    this.location.back();
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

  onOpenConfirmDialog() {
    // this.confirmRefDialog = this.dialog.open(this.confirmDialog, {
    //   width: '500px',
    // });
  }

  onConfirm() {
    // let pinRefDialog = this.dialog.open(PinConfirmationComponent, {
    //   width: '400px',
    // });

    // pinRefDialog.afterClosed().subscribe(isPinValid => {
    //   if (isPinValid) {
    //     this.confirmRefDialog.close();
    //     this.onSendMultiSignatureTransaction();
    //   }
    // });
  }

  async onSendMultiSignatureTransaction() {
    const {
      accountAddress,
      fee,
      multisigInfo,
      unisgnedTransactions,
      signaturesInfo,
      transaction,
    } = this.multisig;
    this.updateSendTransaction();
    const data: MultiSigInterface = {
      accountAddress,
      fee,
      multisigInfo,
      unisgnedTransactions,
      signaturesInfo,
    };

    const childSeed = null; // this.authServ.seed;

    zoobc.MultiSignature.postTransaction(data, childSeed)
      .then(async (res: any) => {
        const message = 'Your Transaction is processing';
        this.utilService.showConfirmation('Success', message, true, '/dashboard');
      })
      .catch(async err => {
        console.log(err.message);
        const message = 'An error occurred while processing your request' ;
        this.utilService.showConfirmation('Fail', message, false, '/dashboard');
      });
  }

  closeDialog() {
    // this.dialog.closeAll();
  }

  async showDialog(title: string, msg: string) {
    const alert = await this.alertController.create({
      cssClass: 'alertCss',
      header: 'Alert',
      subHeader: title,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

}

export async function getTranslation(
  value: string,
  translateService: TranslateService,
  // tslint:disable-next-line:ban-types
  interpolateParams?: Object
) {
  let message: string;
  await translateService
    .get(value, interpolateParams)
    .toPromise()
    .then(res => (message = res));
  return message;
}


