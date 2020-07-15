
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TRANSACTION_MINIMUM_FEE, COIN_CODE } from 'src/environments/variable.const';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Interfaces/account';
import { Subscription } from 'rxjs';
import { MultisigService } from 'src/app/Services/multisig.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import zoobc, { MultiSigInterface, MultisigPostTransactionResponse, sendMoneyBuilder, SendMoneyInterface } from 'zoobc-sdk';
import { Currency } from 'src/app/Interfaces/currency';
import { AuthService } from 'src/app/Services/auth-service';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import { CurrencyService } from 'src/app/Services/currency.service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { UtilService } from 'src/app/Services/util.service';
import { TransactionService } from 'src/app/Services/transaction.service';
import { AccountPopupPage } from '../../account/account-popup/account-popup.page';
import { jsonBufferToString } from 'src/Helpers/utils';
import { SignatureInfo } from 'zoobc-sdk/types/helper/transaction-builder/multisignature';
import { EnterpinsendPage } from '../../send-coin/modals/enterpinsend/enterpinsend.page';
import { makeShortAddress } from 'src/Helpers/converters';


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

  isLoadingBalance = true;
  isLoadingRecentTx = true;
  isLoadingTxFee = false;
  priceInUSD: number;
  primaryCurr = COIN_CODE;
  secondaryCurr: string;
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
  feeFormCurr: number;
  indexSelected: number;
  isMultiSigAccount: boolean;
  timeout: number;

  constructor(
    private utilService: UtilService,
    private alertController: AlertController,
    private router: Router,
    private multisigServ: MultisigService,
    private location: Location,
    private modalController: ModalController,
    private accountService: AccountService,
    private currencyService: CurrencyService,
    private authSrv: AuthService,
    private loadingController: LoadingController,
    private trxService: TransactionService  ) {

    this.accountService.accountSubject.subscribe(() => {
      this.loadAccount();
    });
    this.loadAccount();
  }

  async loadAccount() {
    this.senderAccount = await this.accountService.getCurrAccount();
    this.account = this.senderAccount;
    if (this.account.type !== 'multisig') {
      this.isMultiSigAccount = false;
    } else {
      this.isMultiSigAccount = true;
    }
    this.isLoadingBalance = false;
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

  async copyAddress(address: string) {
    this.utilService.copyToClipboard(address);
  }

  shortAddress(arg: string) {
    return makeShortAddress(arg);
  }

  async ngOnInit() {
    this.loadData();
    await this.loadAccount();

    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {

      const { multisigInfo } = multisig;

      if (multisigInfo === undefined) {
        this.router.navigate(['/multisig']);
      }

      this.multisig = multisig;

      console.log('== this.multisig:', this.multisig);

      const { accountAddress, fee, generatedSender } = this.multisig;
      if (this.isMultiSigAccount) {
        this.account.address = generatedSender;
      } else {
        this.account.address = accountAddress;
      }

      // this.optionFee = multisig.fee.toString();
      this.transactionFee = fee;
      this.feeFormCurr =  multisig.fee * this.currencyRate.value;
      this.timeout = 0;

    });

    this.getMultiSigDraft();

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
    const  fee  = this.transactionFee;
    const multisig = { ...this.multisig };
    if (this.isMultiSigAccount) {
      multisig.accountAddress = this.account.signByAddress;
    } else {
      multisig.accountAddress = this.account.address;
    }
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
    if (Number(this.optionFee) < 0) {
      this.customeChecked = true;
      this.customfeeTemp = this.allFees[2].fee;
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
    this.optionFee = this.allFees[1].fee.toString();
    this.currencyRate = this.currencyService.getRate();
    this.secondaryCurr = this.currencyRate.name;
  }


  sendTransaction() {

    this.transactionFee = Number(this.optionFee);
    if (this.customeChecked) {
      this.transactionFee = this.customfee;
    }

    if (!this.transactionFee) {
      this.transactionFee =  this.allFees[1].fee;
    }

    this.showPin();
  }

  async showPin() {
    const pinmodal = await this.modalController.create({
      component: EnterpinsendPage
    });

    pinmodal.onDidDismiss().then((returnedData) => {
       if (returnedData && returnedData.data !== 0) {
          this.submit();
      }
    });
    return await pinmodal.present();
  }


  private async submit() {
    // show loading bar
    const loading = await this.loadingController.create({
      message: 'processing ..!',
      duration: 50000
    });
    loading.present();
    // end off


    this.updateSendTransaction();
    const {
      accountAddress,
      fee,
      multisigInfo,
      unisgnedTransactions,
      signaturesInfo,
    } = this.multisig;

    console.log('=== signaturesInfo:', signaturesInfo);
    let data: MultiSigInterface;
    if (signaturesInfo !== undefined) {
      console.log('=== masuk 1:');
      const signatureInfoFilter: SignatureInfo = {
        txHash: signaturesInfo.txHash,
        participants: [],
      };
      signatureInfoFilter.participants = signaturesInfo.participants.filter(pcp => {
        if (jsonBufferToString(pcp.signature).length > 0) { return pcp; }
      });

      // == manuallyu
      const trx = this.multisig.transaction;
      const dataUnsig: SendMoneyInterface = {
        sender: trx.sender,
        recipient: trx.recipient,
        fee: trx.fee,
        amount: trx.amount,
      };
      const unsigTrx = this.multisig.unisgnedTransactions = sendMoneyBuilder(dataUnsig);
      // end off

      data = {
        accountAddress,
        fee,
        multisigInfo,
        unisgnedTransactions: unsigTrx,
        signaturesInfo: signatureInfoFilter,
      };
    } else {
      console.log('=== masuk 2:');
      data = {
        accountAddress,
        fee,
        multisigInfo,
        unisgnedTransactions,
        signaturesInfo,
      };
    }

    console.log('== data: ', data);

    const key = this.authSrv.tempKey;

    const signByAddress = this.account.signByAddress;
    const signByAcc = await this.accountService.getAccount(signByAddress);
    const childSeed = await this.utilService.generateSeed(key, signByAcc.path);
    // const childSeed = await this.utilService.generateSeed(key, this.account.path);
    console.log('== childSeed: ', childSeed);

    await zoobc.MultiSignature.postTransaction(data, childSeed)
      .then( async (res: MultisigPostTransactionResponse) => {
        const message = 'Your Transaction is processing!';
        this.utilService.showConfirmation('Succes', message, true, null);

        this.multisigServ.deleteDraft(this.multisig.id);
        this.router.navigateByUrl('/dashboard');

      })
      .catch( async err => {
        console.log(err);
        const message = err.messsage +  '; An error occurred while processing your request';
        this.utilService.showConfirmation('Fail', message, false, null);
      }).finally(() => {
        console.log('=== data after: ', data);
        loading.dismiss();
      });
  }


}




