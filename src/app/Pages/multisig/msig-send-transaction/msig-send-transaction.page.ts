
import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { TRANSACTION_MINIMUM_FEE } from 'src/environments/variable.const';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Interfaces/account';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { truncate } from 'src/helpers/utils';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MultiSigDraft, MultisigService } from 'src/app/services/multisig.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import zoobc, { MultiSigInterface } from 'zoobc-sdk';
import { Currency } from 'src/app/Interfaces/currency';
import { AuthService } from 'src/app/Services/auth-service';
import { AlertController } from '@ionic/angular';
import { CurrencyService } from 'src/app/Services/currency.service';


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
    private authServ: AuthService,
    private currencyServ: CurrencyService,
    private alertController: AlertController,
    private translate: TranslateService,
    private router: Router,
    private multisigServ: MultisigService,
    private location: Location,
    private accountSrv: AccountService
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
    this.accountSrv.getCurrAccount().then(acc => {
      this.account = acc;
    });
    const subsRate = this.currencyServ.rate.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      const minCurrency = truncate(this.minFee * rate.value, 8);
      this.feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
    });
    this.subscription.add(subsRate);

    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      this.multisig = multisig;

      const { accountAddress, fee } = this.multisig;
      this.account.address = accountAddress;
      this.feeForm.setValue(multisig.fee);
      this.feeFormCurr.setValue(multisig.fee * this.currencyRate.value);
      this.timeoutField.setValue('0');
      if (fee === this.feeSlow) {
        this.typeFee = 1;
        this.kindFee = 'Slow';
      } else if (fee === this.feeMedium) {
        this.typeFee = 2;
        this.kindFee = 'Average';
      } else if (fee === this.feeFast) {
        this.typeFee = 3;
        this.kindFee = 'Fast';
      } else {
        this.customFeeValues = multisig.fee;
        this.kindFee = 'Custom';
      }
    });
    this.getMultiSigDraft();
  }

  getMultiSigDraft() {
    this.multiSigDrafts = this.multisigServ.getDrafts();
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
    this.updateSendTransaction();
    const data: MultiSigInterface = {
      accountAddress: this.multisig.accountAddress,
      fee: this.multisig.fee,
      multisigInfo: this.multisig.multisigInfo,
      unisgnedTransactions: this.multisig.unisgnedTransactions,
      signaturesInfo: this.multisig.signaturesInfo,
    };
    const childSeed = this.authServ.seed;

    zoobc.MultiSignature.postTransaction(data, childSeed)
      .then(async (res: any) => {
        let message = '';
        await this.translate
          .get('Your Transaction is processing')
          .toPromise()
          .then(resp => {
            message = resp;
          });
        let subMessage = '';
        await this.translate
          .get('You send coins to', {
            amount: data.unisgnedTransactions.amount,
            currencyValue: truncate(data.unisgnedTransactions.amount * this.currencyRate.value, 2),
            currencyName: this.currencyRate.name,
            recipient: data.unisgnedTransactions.recipient,
          })
          .toPromise()
          .then(resp => { subMessage = resp; });
        this.multisigServ.deleteDraft(this.multisig.id);
        this.showDialog(message, subMessage, 'success');
        this.router.navigateByUrl('/dashboard');
      })
      .catch(async err => {
        console.log(err.message);
        let message: string;
        await this.translate
          .get('An error occurred while processing your request')
          .toPromise()
          .then(res => (message = res));
        this.showDialog('Opps...', message, 'error');
      });
  }

  closeDialog() {
    // this.dialog.closeAll();
  }

  async showDialog(title: string, msg: string, ertxt: string) {
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

