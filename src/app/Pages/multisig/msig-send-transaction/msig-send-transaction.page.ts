
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TRANSACTION_MINIMUM_FEE, COIN_CODE } from 'src/environments/variable.const';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Interfaces/account';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { truncate } from 'src/Helpers/utils';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MultisigService } from 'src/app/Services/multisig.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import zoobc, { MultiSigInterface } from 'zoobc-sdk';
import { Currency } from 'src/app/Interfaces/currency';
import { AuthService } from 'src/app/Services/auth-service';
import { AlertController, LoadingController, ModalController, ToastController, MenuController } from '@ionic/angular';
import { CurrencyService } from 'src/app/Services/currency.service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { UtilService } from 'src/app/Services/util.service';
import { QrScannerService } from '../../../Services/qr-scanner.service';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { TransactionService } from 'src/app/Services/transaction.service';
import { AccountPopupPage } from '../../account/account-popup/account-popup.page';


@Component({
  selector: 'app-msig-send-transaction',
  templateUrl: './msig-send-transaction.page.html',
  styleUrls: ['./msig-send-transaction.page.scss'],
})
export class MsigSendTransactionPage implements OnInit, OnDestroy {


  subscription: Subscription = new Subscription();
  account: Account;
  senderAccount: Account;
  minFee = TRANSACTION_MINIMUM_FEE;

  currencyRate: Currency;
  trxFee: string;
  advancedMenu = false;


  public isLoadingBalance = true;
  public isLoadingRecentTx = true;
  public isLoadingTxFee = false;
  public priceInUSD: number;
  public primaryCurr = COIN_CODE;
  public secondaryCurr: string;
  customfeeTemp: number;
  optionFee: string;
  customfee: number;
  customfee2: number;
  transactionFee: number;
  allFees = this.trxService.transactionFees(TRANSACTION_MINIMUM_FEE);
  isAmountValid = true;
  isFeeValid = true;
  isCustomFeeValid = true;
  isRecipientValid = true;
  isApproverValid = true;
  isBalanceValid = true;

  errorMsg: string;
  customeChecked: boolean;

  kindFee: string;
  multisig: MultiSigDraft;
  multisigSubs: Subscription;
  multiSigDrafts: MultiSigDraft[];

  feeSlow = TRANSACTION_MINIMUM_FEE;
  feeMedium = this.feeSlow * 2;
  feeFast = this.feeMedium * 2;
  typeFee: number;
  customFeeValues: number;

  minimumFee = TRANSACTION_MINIMUM_FEE;
  recipientAddress: string;
  multisigTimout: number;
  feeFormCurr: number;
  indexSelected: number;

  constructor(
    private utilService: UtilService,
    private alertController: AlertController,
    private router: Router,
    private multisigServ: MultisigService,
    private location: Location,
    public loadingController: LoadingController,
    private modalController: ModalController,
    private activeRoute: ActivatedRoute,
    private toastController: ToastController,
    private menuController: MenuController,
    private accountService: AccountService,
    private qrScannerService: QrScannerService,
    private currencyService: CurrencyService,
    public addressbookService: AddressBookService,
    private authSrv: AuthService,
    private accSrv: AccountService,
    private trxService: TransactionService,
    private translate: TranslateService
  ) {

    this.accountService.accountSubject.subscribe(() => {
      this.loadAccount();
    });
    this.loadAccount();
  }

  async loadAccount() {
    this.senderAccount = await this.accountService.getCurrAccount();
    this.account = this.senderAccount;
    this.getAccountBalance(this.account.address);
  }

  switchAccount() {
    this.showPopupAccount();
    this.getAccountBalance(this.account.address);
  }

  async showPopupAccount() {
    const modal = await this.modalController.create({
      component: AccountPopupPage,
      componentProps: {
        idx: 0
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.account  =  dataReturned.data;
      }
    });

    return await modal.present();
  }


  async ngOnInit() {
    this.loadData();
    await this.loadAccount();

    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {

      const { multisigInfo } = multisig;
      if (multisigInfo === undefined) { this.router.navigate(['/multisig']); }

      this.multisig = multisig;
      const { accountAddress, fee } = this.multisig;
      this.account.address = accountAddress;
      this.transactionFee = fee;
      this.feeFormCurr =  multisig.fee * this.currencyRate.value;
      this.multisigTimout = 0;

    });

    this.getMultiSigDraft();

  }


  async getAccountBalance(addr: string) {
    this.isLoadingBalance = true;
    await zoobc.Account.getBalance(addr)
      .then(data => {
        if (data.accountbalance && data.accountbalance.spendablebalance) {
          const blnc = Number(data.accountbalance.spendablebalance) / 1e8;
          this.account.balance = blnc;
        }
      })
      .catch(error => {
        this.errorMsg = '';
        if (error === 'Response closed without headers') {
          this.errorMsg = 'Fail connect to services, please try again!';
        }
        this.account.balance = 0;
      })
      .finally(() => (this.isLoadingBalance = false));
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
    const multisig = { ...this.multisig };
    multisig.accountAddress = this.account.address;
    multisig.fee = this.transactionFee;
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

  changeFee() {
    this.customeChecked = false;
    console.log('==== changeFee, trxFee: ', this.optionFee);
    if (Number(this.optionFee) < 0) {
      this.customeChecked = true;
      this.customfeeTemp = this.allFees[0].fee;
    }
  }

  convertCustomeFee() {
    if (this.primaryCurr === COIN_CODE) {
      this.customfee = this.customfeeTemp;
      this.customfee2 = this.customfeeTemp * this.priceInUSD * this.currencyRate.value;
    } else {
      this.customfee = this.customfeeTemp / this.priceInUSD / this.currencyRate.value;
      this.customfee2 = this.customfee;
    }
  }

  validateCustomFee() {

    this.convertCustomeFee();
    if (this.minimumFee > this.customfee) {
      this.isCustomFeeValid = false;
      return;
    }

    if (this.customfee && this.customfee > 0) {
      this.isCustomFeeValid = true;
    } else {
      this.isCustomFeeValid = false;
    }
  }


  loadData() {
    this.recipientAddress = '';
    this.optionFee = this.allFees[0].fee.toString();
    this.currencyRate = this.currencyService.getRate();
    this.secondaryCurr = this.currencyRate.name;
  }

  async sendTransaction() {

    this.transactionFee = Number(this.optionFee);

    if (this.customeChecked) {
      this.transactionFee = this.customfee;
    }

    console.log('== 1 ==, trxFee: ', this.transactionFee);

    if (!this.transactionFee) {
      this.transactionFee =  this.multisig.fee;
      // this.isFeeValid = false;
      // return;
    }

    console.log('=== Before send- Address: ', this.account.address);
    console.log('=== Before send- Fee: ', this.transactionFee );

    const multisig = { ...this.multisig };
    multisig.accountAddress = this.account.address;
    multisig.fee = this.transactionFee;

    console.log('=== Before send- multisig: ',  multisig );

    const {
      accountAddress,
      fee,
      multisigInfo,
      unisgnedTransactions,
      signaturesInfo,
      transaction,
    }  =  multisig;

    const data: MultiSigInterface = {
      accountAddress,
      fee,
      multisigInfo,
      unisgnedTransactions,
      signaturesInfo,
    };

    console.log('=== Data: ', data);

    const key = this.authSrv.tempKey;
    const seed = await this.utilService.generateSeed(key, this.account.path);
    // const childSeed = await this.utilService.generateSeed(pin, this.account.path);

    await zoobc.MultiSignature.postTransaction(data, seed)
      .then( async (res: any) => {
        console.log(res);
        const message = 'Your Transaction is processing!';
        this.utilService.showConfirmation('Succes', message, true, null);

        this.multisigServ.deleteDraft(this.multisig.id);
        this.router.navigateByUrl('/dashboard');

      })
      .catch(async err => {
        console.log(err.message);

        const message = 'An error occurred while processing your request';
        this.utilService.showConfirmation('Fail', message, false, null);
      });
  }


}




