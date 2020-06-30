import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/Interfaces/account';
import { MultisigService } from 'src/app/Services/multisig.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TRANSACTION_MINIMUM_FEE, CONST_DEFAULT_CURRENCY, COIN_CODE } from 'src/environments/variable.const';
import { Currency } from 'src/app/Interfaces/currency';
import { AccountService } from 'src/app/Services/account.service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { environment } from 'src/environments/environment';
import { LoadingController, ModalController, AlertController, ToastController, MenuController } from '@ionic/angular';
import { QrScannerService } from '../../qr-scanner/qr-scanner.service';
import { CurrencyService } from 'src/app/Services/currency.service';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from 'src/app/Services/util.service';
import { TransactionService } from 'src/app/Services/transaction.service';
import { calculateMinFee, sanitizeString, stringToBuffer } from 'src/Helpers/utils';
import { base64ToByteArray } from 'src/Helpers/converters';
import zoobc, { SendMoneyInterface, generateTransactionHash, sendMoneyBuilder } from 'zoobc-sdk';
import { CurrencyComponent } from 'src/app/Components/currency/currency.component';
import { EnterpinsendPage } from '../../send-coin/modals/enterpinsend/enterpinsend.page';
import { SenddetailPage } from '../../send-coin/modals/senddetail/senddetail.page';
import { TrxstatusPage } from '../../send-coin/modals/trxstatus/trxstatus.page';
import { AccountPopupPage } from '../../account/account-popup/account-popup.page';
import { getTranslation } from '../msig-send-transaction/msig-send-transaction.page';

@Component({
  selector: 'app-msig-create-transaction',
  templateUrl: './msig-create-transaction.page.html',
  styleUrls: ['./msig-create-transaction.page.scss'],
})
export class MsigCreateTransactionPage implements OnInit, OnDestroy {

  recipientAddress = '';
  senderAddress = '';
  amount = 0;
  amountSecond = 0;
  amountTemp = 0;
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
  accountName = '';
  recipientMsg = '';
  approverMsg = '';
  amountMsg = '';
  allAccounts = [];
  errorMsg: string;
  customeChecked: boolean;
  private connectionText = '';
  public currencyRate: Currency = {
    name: CONST_DEFAULT_CURRENCY,
    value: environment.zbcPriceInUSD,
  };

  public isLoadingBalance = true;
  public isLoadingRecentTx = true;
  public isLoadingTxFee = false;
  public priceInUSD: number;
  public primaryCurr = COIN_CODE;
  public secondaryCurr: string;

  private minimumFee = TRANSACTION_MINIMUM_FEE;
  isLoadingBlockHeight: boolean;
  blockHeight: number;


  minFee = TRANSACTION_MINIMUM_FEE;
  kindFee: string;
  subscription: Subscription = new Subscription();
  account: Account;


  multisig: MultiSigDraft;
  multisigSubs: Subscription;
  multiSigDrafts: MultiSigDraft[];

  stepper = {
    multisigInfo: false,
    signatures: false,
  };
  removeExport: boolean;
  isHasTransactionHash: boolean;
  isMultiSignature = true;
  txHash: string;

  constructor(
    private multisigServ: MultisigService,
    private router: Router,
    public loadingController: LoadingController,
    private modalController: ModalController,
    public alertController: AlertController,
    private activeRoute: ActivatedRoute,
    private toastController: ToastController,
    private menuController: MenuController,
    private accountService: AccountService,
    private qrScannerService: QrScannerService,
    private currencyService: CurrencyService,
    public addressbookService: AddressBookService,
    private translateService: TranslateService,
    private utilService: UtilService,
    private trxService: TransactionService,
    private translate: TranslateService
  ) {


    this.accountService.accountSubject.subscribe(() => {
      this.loadAccount();
    });

    this.addressbookService.addressSubject.subscribe({
      next: address => {
        this.recipientAddress = address;
      }
    });

    this.accountService.recipientSubject.subscribe({
      next: recipient => {
        this.recipientAddress = recipient.address;
      }
    });

    this.currencyService.currencySubject.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      this.secondaryCurr = rate.name;
    });

    this.priceInUSD = this.currencyService.getPriceInUSD();
    // this.loadAccount();

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.multisigSubs.unsubscribe();
  }

  async loadAccount() {
    this.account = await this.accountService.getCurrAccount();
    this.getAccountBalance(this.account.address);
  }

  ngOnInit() {
    this.loadData();
    // Multisignature Subscription
    this.multisigSubs = this.multisigServ.multisig.subscribe(async multisig => {
      const { multisigInfo, unisgnedTransactions, signaturesInfo, transaction } = multisig;
      if (unisgnedTransactions === undefined) {
        this.router.navigate(['/multisig']);
      }

      await this.loadAccount();
      this.multisig = multisig;
      this.removeExport = signaturesInfo !== undefined ? true : false;
      if (signaturesInfo) {
        this.isHasTransactionHash = signaturesInfo.txHash !== undefined ? true : false;
      }
      if (unisgnedTransactions) {
        const { sender, recipient, amount, fee } = transaction;
        this.account.address = sender;
        this.senderAddress = sender;
        this.recipientAddress = recipient;
        this.amount = amount;
        this.transactionFee = fee;
      } else if (this.isMultiSignature) {
        this.multisig.generatedSender = this.account.address;
        this.senderAddress = this.account.address;
      } else {
        this.senderAddress = this.multisig.generatedSender;
      }
      this.stepper.multisigInfo = multisigInfo !== undefined ? true : false;
      this.stepper.signatures = signaturesInfo !== undefined ? true : false;
    });
  }

  customTrackBy(index: number): any {
    return index;
  }

  async next() {

    const isValid = this.isFormValid();
    if (!isValid) {
        return;
    }
    const { signaturesInfo } = this.multisig;

    console.log('==== AAAA multisig: ', this.multisig);

    if (!this.multisig.unisgnedTransactions) {

      console.log('==== YYYY multisig-1: ');

      this.generatedTxHash();
      // this.updateCreateTransaction();

      // aditional
      // const multisig = { ...this.multisig };
      this.multisigServ.update(this.multisig);
      // end of

      if (signaturesInfo === undefined) {
        console.log('==== YYYY multisig-1a: ');
        this.router.navigate(['/msig-send-transaction']);
      } else {
        console.log('==== YYYY multisig-1b: ');
        this.router.navigate(['/msig-add-signatures']);
      }

    } else if (signaturesInfo !== undefined) {
      console.log('==== YYYY multisig-2: ');
      this.router.navigate(['/msig-add-signatures']);
    } else {
      console.log('==== YYYY multisig-3: ');
      this.router.navigate(['/msig-send-transaction']);
    }

  }


  async generatedTxHash() {
    this.updateCreateTransaction();
    console.log('XXXX ==== Multisig4: ', this.multisig);
    const { amount, fee, recipient, sender } = this.multisig.transaction;

    const data: SendMoneyInterface = {
      sender: this.account.address,
      recipient: sanitizeString(this.recipientAddress),
      fee: this.transactionFee,
      amount: this.amount
    };

    const accounts = await this.accountService.allAccount();
    const account = accounts.find(acc => acc.address === sender);
    const participantAccount = [];

    if (this.multisig.unisgnedTransactions !== undefined) {
      this.multisig.unisgnedTransactions = sendMoneyBuilder(data);
    }

    if (this.multisig.signaturesInfo !== undefined) {
      if (account) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < account.participants.length; i++) {
          const participant = {
            address: account.participants[i],
            signature: stringToBuffer(''),
          };
          participantAccount.push(participant);
        }
      } else {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.multisig.multisigInfo.participants.length; i++) {
          const participant = {
            address: this.multisig.multisigInfo.participants[i],
            signature: stringToBuffer(''),
          };
          participantAccount.push(participant);
        }
      }
      this.txHash = generateTransactionHash(data);
      this.multisig.signaturesInfo = {
        txHash: this.txHash,
        participants: participantAccount,
      };

      this.isHasTransactionHash = true;
      this.multisig.generatedSender = this.multisig.transaction.sender;
    }
  }

  saveDraft() {
    this.updateCreateTransaction();
    if (this.multisig.id) {
      this.multisigServ.editDraft();
    } else {
      this.multisigServ.saveDraft();
    }
    this.router.navigate(['/multisig']);
  }


  updateCreateTransaction() {
  
    const address = this.multisig.generatedSender || this.account.address;

    this.multisig.transaction = {
      sender: address,
      amount: this.amount,
      fee: this.transactionFee,
      recipient: sanitizeString(this.recipientAddress),
    };
    // console.log('===temp mulstisig: ', multisig);
  }

  switchCurrency() {

    const first = this.primaryCurr.slice();
    if (first === COIN_CODE) {
      this.primaryCurr = this.currencyRate.name;
      this.secondaryCurr = COIN_CODE;
    } else {
      this.primaryCurr = COIN_CODE;
      this.secondaryCurr = this.currencyRate.name;
    }

    this.convertAmount();
    this.convertCustomeFee();
  }

  ionViewDidEnter() {
    this.amountMsg = '';
    this.isAmountValid = true;
  }


  loadData() {
    this.recipientAddress = '';
    this.getRecipientFromScanner();
    this.optionFee = this.allFees[0].fee.toString();
    this.currencyRate = this.currencyService.getRate();
    this.secondaryCurr = this.currencyRate.name;
  }

  getBlockHeight() {
    this.isLoadingBlockHeight = true;
    zoobc.Host.getInfo()
      .then(res => {
        this.blockHeight = res.chainstatusesList[1].height;
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => (this.isLoadingBlockHeight = false));
  }



  openMenu() {
    this.menuController.open('mainMenu');
  }

  async openListAccount(arg: string) {
    const modal = await this.modalController.create({
      component: AccountPopupPage
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        // this.signByAccount =  dataReturned.data;
        // this.signBy = this.signByAccount.address;
      }
    });

    return await modal.present();
  }


  async presentGetAddressOption() {
    const alert = await this.alertController.create({
      header: 'Select Option',
      cssClass: 'alertCss',
      inputs: [
        {
          name: 'opsi1',
          type: 'radio',
          label: 'Scan QR Code',
          value: 'scan',
          checked: true
        },
        {
          name: 'opsi2',
          type: 'radio',
          label: 'Address Book',
          value: 'address'
        },
        {
          name: 'opsi3',
          type: 'radio',
          label: 'My Accounts',
          value: 'account'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // console.log('Confirm Cancel', val);
          }
        }, {
          text: 'Ok',
          handler: (val) => {
            // console.log('Confirm Ok', val);
            if (val === 'address') {
              this.openAddresses();
            } else if (val === 'account') {
              this.openListAccount('recipient');
            } else {
              this.scanQrCode();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async changeCurrency() {
    const currencyModal = await this.modalController.create({
      component: CurrencyComponent,
      cssClass: 'modal-fullscreen'
    });

    currencyModal.onDidDismiss().then((returnedData) => {
      if (returnedData && returnedData.data !== '-') {
        const currCode = returnedData.data;
        this.currencyService.setActiveCurrency(currCode);
      }
    });

    return await currencyModal.present();
  }


  showLoading() {
    this.loadingController.create({
      message: 'Loading ...',
      duration: 2000
    }).then((res) => {
      res.present();
    });
  }

  doRefresh(event: any) {
    // console.log('Reloading data ....');
    this.showLoading();
    this.loadData();

    setTimeout(() => {
      event.target.complete();
    }, 5000);

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

  validateTimeout() {
    // this.minimumFee = calculateMinFee(this.escrowTimout);
    // this.allFees = this.trxService.transactionFees(this.minimumFee);
    // this.optionFee = this.allFees[0].fee.toString();
    // if (this.customeChecked) {
    //     this.validateCustomFee();
    // }
    // this.getBlockHeight();
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


  convertAmount() {
    if (!this.amountTemp) {
      this.amountTemp = 0;
    }
    if (this.primaryCurr === COIN_CODE) {
      this.amount = this.amountTemp;
      this.amountSecond = this.amountTemp * this.priceInUSD * this.currencyRate.value;
    } else {
      this.amount = this.amountTemp / this.priceInUSD / this.currencyRate.value;
      this.amountSecond = this.amount;
    }
  }

  validateAmount() {

    this.convertAmount();

    this.isAmountValid = true;
    this.amountMsg = '';
    if (!this.amount) {
      this.amountMsg = this.translateService.instant('Amount required!');
      this.isAmountValid = false;
      return;
    }

    if (this.isAmountValid && isNaN(this.amount)) {
      this.isAmountValid = false;
      return;
    }

    if (this.isAmountValid && this.amount <= 0) {
      this.isAmountValid = false;
      return;
    }

    if (!this.isLoadingBalance) {

      if (this.isAmountValid && (this.amount + Number(this.optionFee)) > this.account.balance) {
        this.amountMsg = this.translateService.instant('Insufficient balance');
        this.isAmountValid = false;
        return;
      }
    }

  }


  validateRecipient() {
    this.isRecipientValid = true;
    console.log('===== Recipient: ', this.recipientAddress);
    this.recipientAddress = sanitizeString(this.recipientAddress);

    if (!this.recipientAddress || this.recipientAddress === '' || this.recipientAddress === null) {
      this.isRecipientValid = false;
      this.recipientMsg = this.translateService.instant('Recipient is required!');
      return;
    }

    if (this.isRecipientValid) {
      const addressBytes = base64ToByteArray(this.recipientAddress);
      if (this.isRecipientValid && addressBytes.length !== 33) {
        this.isRecipientValid = false;
        this.recipientMsg = this.translateService.instant('Address is not valid!');
        return;
      }
    }
  }

  async inputPIN() {

    const pinmodal = await this.modalController.create({
      component: EnterpinsendPage,
      componentProps: {

      }
    });


    pinmodal.onDidDismiss().then((returnedData) => {
      console.log('=== returned after entr pin: ', returnedData);
      if (returnedData && returnedData.data !== 0) {
        const pin = returnedData.data;
        this.sendMoney(pin);
      }
    });
    return await pinmodal.present();
  }

  getRecipientFromScanner() {
    this.activeRoute.queryParams.subscribe(params => {
      if (params && params.jsonData) {
        const json = JSON.parse(params.jsonData);
        this.recipientAddress = json.address;
        this.amountTemp = Number(json.amount);
        this.amountSecond = this.amountTemp * this.priceInUSD * this.currencyRate.value;
      }
    });
  }

  async presentNoConnectionToast() {
    const toast = await this.toastController.create({
      message: this.connectionText,
      duration: 3000
    });
    toast.present();
  }


  async showConfirmation() {

    if (!this.isFormValid()) {
      return;
    }

    const modalDetail = await this.modalController.create({
      component: SenddetailPage,
      componentProps: {
        trxFee: this.transactionFee,
        trxAmount: Number(this.amount),
        trxBalance: this.account.balance,
        trxSender: this.account.address,
        trxRecipient: this.recipientAddress,
        trxCurrencyRate: this.currencyRate,
      }
    });

    console.log('== 6 ==');

    modalDetail.onDidDismiss().then((dataReturned) => {
      if (dataReturned) {
        if (dataReturned.data === 1) {
          // console.log('==  detail accepted');
          this.inputPIN();
        } else {
          // console.log('==  detail closed');
        }
      }
    });
    console.log('== 7 ==');

    return await modalDetail.present();
  }

  isFormValid(): boolean {
    this.isAmountValid = true;
    this.isFeeValid = true;
    this.isRecipientValid = true;
    this.recipientMsg = '';
    this.amountMsg = '';

    // validate recipient
    this.validateRecipient();
    this.validateAmount();
    this.transactionFee = Number(this.optionFee);

    if (this.customeChecked) {
      this.transactionFee = this.customfee;
    }

    console.log('== 1 ==, trxFee: ', this.transactionFee);

    if (!this.transactionFee) {
      this.isFeeValid = false;
    }

    if (Number(this.transactionFee) < 0) {
      this.isFeeValid = false;
    }

    if (this.transactionFee < this.minimumFee) {
      this.isFeeValid = false;
      if (this.customeChecked) {
        this.isCustomFeeValid = false;
      }
    }

    console.log('== this.amount ==', this.amount);
    console.log('== this.recipientAddress ==', this.recipientAddress);
    console.log('== this.isAmountValid ==', this.isAmountValid);
    console.log('== this.isAmountValidisFeeValid ==', this.isFeeValid);

    if (!this.amount || !this.recipientAddress || !this.isRecipientValid || !this.isAmountValid || !this.isFeeValid) {
      return false;
    }

    console.log('== 2 ==');

    const amount = this.amount;
    if (amount > 0 && amount < 0.000000001) {
      this.isAmountValid = false;
      return false;
    }

    console.log('== 3 ==');

    if (this.amount === 0) {
      this.isAmountValid = false;
      return false;
    }

    console.log('== 4 ==');


    const total = (amount + this.transactionFee);
    // console.log('-- Total: ', total);

    if (total > Number(this.account.balance)) {
      this.isAmountValid = false;
      this.amountMsg = 'Insuficient balance';
      return false;
    }

    console.log('== 5 ==');
    return true;
  }

  sanitizeInput() {

  }

  async sendMoney(pin: string) {

    // show loading bar
    const loading = await this.loadingController.create({
      message: 'Please wait, submiting!',
      duration: 50000
    });

    await loading.present();

    const data: SendMoneyInterface = {
      sender: this.account.address,
      recipient: sanitizeString(this.recipientAddress),
      fee: this.transactionFee,
      amount: this.amount,
    };

    console.log('==== Send Money: data', data);
    // const childSeed = this.seed;
    const childSeed = await this.utilService.generateSeed(pin, this.account.path);
    await zoobc.Transactions.sendMoney(data, childSeed).then(
      (resolveTx: any) => {
        console.log('====== SendMOney resolveTx:', resolveTx);
        if (resolveTx) {
          this.recipientAddress = '';
          this.amount = 0;
          this.showSuccessMessage();
          return;
        }
      },
      error => {
        console.log('===== sendMoney, error: ', error);
        this.showErrorMessage(error);
      }
    ).finally(() => {
      loading.dismiss();
    });
  }

  async showErrorMessage(error) {
    const modal = await this.modalController.create({
      component: TrxstatusPage,
      componentProps: {
        msg: error,
        status: false
      }
    });

    modal.onDidDismiss().then(data => {
      console.log(data);
    });

    return await modal.present();
  }

  async showSuccessMessage() {
    const modal = await this.modalController.create({
      component: TrxstatusPage,
      componentProps: {
        msg: 'transaction succes',
        status: true
      }
    });

    modal.onDidDismiss().then(data => {
      console.log(data);
    });

    return await modal.present();
  }

  switchAccount() {
    // console.log('=== accounts: ', this.account);
    this.isAmountValid = true;
    this.isRecipientValid = true;
    this.amount = null;
  }

  changeFee() {
    this.customeChecked = false;
    console.log('==== changeFee, trxFee: ', this.optionFee);
    if (Number(this.optionFee) < 0) {
      this.customeChecked = true;
      this.customfeeTemp = this.allFees[0].fee;
    }
  }

  scanQrCode() {
    this.router.navigateByUrl('/qr-scanner');
    this.qrScannerService.listen().subscribe((jsonData: string) => {
      const data = JSON.parse(jsonData);
      this.recipientAddress = data.address;
      this.amountTemp = Number(data.amount);
      this.amountSecond = this.amountTemp * this.priceInUSD * this.currencyRate.value;
    });
  }

  goDashboard() {
    this.router.navigate(['/dashboard']);
  }

  confirmSend() {
    this.router.navigate(['sendconfirm']);
  }

  openAddresses() {
    this.router.navigateByUrl('/address-book');
  }


  async getMinimumFee(timeout: number) {
    const fee: number = calculateMinFee(timeout);
    return fee;
  }

}
