import { Component,  OnInit } from '@angular/core';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import {
  MenuController,
  ModalController
} from '@ionic/angular';

import { base64ToByteArray } from 'src/Helpers/converters';
import { QrScannerService } from 'src/app/Pages/qr-scanner/qr-scanner.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { SenddetailPage } from 'src/app/Pages/send-coin/modals/senddetail/senddetail.page';
import { EnterpinsendPage } from 'src/app/Pages/send-coin/modals/enterpinsend/enterpinsend.page';
import { TrxstatusPage } from 'src/app/Pages/send-coin/modals/trxstatus/trxstatus.page';
import { TranslateService } from '@ngx-translate/core';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { CurrencyService } from 'src/app/Services/currency.service';
import { environment } from 'src/environments/environment';
import { CurrencyComponent } from 'src/app/Components/currency/currency.component';
import {
  COIN_CODE, TRX_FEE_LIST,
  CONST_DEFAULT_CURRENCY,
  TRANSACTION_MINIMUM_FEE} from 'src/environments/variable.const';
import { Account } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
import zoobc, {
  SendMoneyInterface} from 'zoobc';
import { calculateMinFee, sanitizeString} from 'src/Helpers/utils';
import { makeShortAddress } from 'src/Helpers/converters';
import { UtilService } from 'src/app/Services/util.service';
import { Approver } from 'src/app/Interfaces/approver';
import { Currency } from 'src/app/Interfaces/currency';
import { TransactionService } from 'src/app/Services/transaction.service';

@Component({
  selector: 'app-send-coin',
  templateUrl: 'send-coin.page.html',
  styleUrls: ['send-coin.page.scss']
})

export class SendCoinPage implements OnInit {
  approvers =  [];
  rootPage: any;
  status: any;
  account: Account;
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
  isAdvance = false;
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

  escrowApprover = '';
  escrowCommision = 0;
  escrowTimout = 0;
  escrowInstruction = '';
  private minimumFee = TRANSACTION_MINIMUM_FEE;
  isLoadingBlockHeight: boolean;
  blockHeight: number;

  constructor(
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
    private addressBookSrv: AddressBookService,
    private utilService: UtilService,
    private trxService: TransactionService
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

    // if currency changed
    this.currencyService.currencySubject.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      this.secondaryCurr = rate.name;
    });

    this.priceInUSD = this.currencyService.getPriceInUSD();
    // console.log('===== loading consturctro ==');
    this.loadAccount();
  }

  selectApprover() {
    console.log('===== escrow approver: ', this.escrowApprover);
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

  async ngOnInit() {
    this.recipientAddress = '';
    this.approvers =  [];
    this.loadData();
    this.getAllAddress();
    this.getAllAccount();
  }

  ionViewDidEnter() {
    this.amountMsg = '';
    this.isAmountValid = true;
  }


  async getAllAccount() {
    const accounts = await this.accountService.allAccount();

    if (accounts && accounts.length > 0) {
      accounts.forEach((obj: { name: any; address: string; }) => {
        const app: Approver = {
          name: obj.name,
          address: obj.address,
          shortAddress: makeShortAddress(obj.address)
        };
        this.approvers.push(app);
      });
    }

  }

  loadData() {
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


  async getAllAddress() {
    const alladdress = await this.addressBookSrv.getAll();

    if (alladdress && alladdress.length > 0) {
      alladdress.forEach((obj: { name: any; address: string; }) => {
        const app: Approver = {
          name: obj.name,
          address: obj.address,
          shortAddress: makeShortAddress(obj.address) };
        this.approvers.push(app);
      });
    }
  }

  openMenu() {
    this.menuController.open('mainMenu');
  }

  openListAccount(arg: string) {
    // console.log('==== arg send coin:', arg);
    const navigationExtras: NavigationExtras = {
      state: {
        forWhat: arg
      }
    };
    this.router.navigate(['list-account'], navigationExtras);
  }

  async presentGetAddressOption() {
    const alert = await this.alertController.create({
      header: 'Select Option',
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

  async loadAccount() {
    this.account = await this.accountService.getCurrAccount();
    this.getAccountBalance(this.account.address);
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
    this.minimumFee = calculateMinFee(this.escrowTimout);
    this.allFees = this.trxService.transactionFees(this.minimumFee);
    this.optionFee = this.allFees[0].fee.toString();
    if (this.customeChecked) {
        this.validateCustomFee();
    }
    this.getBlockHeight();
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

  validateApprover() {
    this.isApproverValid = true;
    console.log('===== approverAddress: ', this.escrowApprover);

    if (!this.escrowApprover || this.escrowApprover === '' || this.escrowApprover === null) {
      this.isApproverValid = false;
      this.approverMsg = this.translateService.instant('Approver address is required!');
      return;
    }

    if (this.isApproverValid) {
      const addressBytes = base64ToByteArray(this.escrowApprover);
      if (this.isApproverValid && addressBytes.length !== 33) {
        this.isApproverValid = false;
        this.approverMsg = this.translateService.instant('Approver address is not valid!');
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

  showAdvance() {
    if (this.isAdvance) {
      this.isAdvance = false;
    } else {
      this.isAdvance = true;
    }

    if (!this.isAdvance) {
      this.minimumFee = TRANSACTION_MINIMUM_FEE;
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

    if (this.isAdvance) {
      this.minimumFee = await this.getMinimumFee(this.escrowTimout);
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
      return;
    }

    console.log('== 2 ==');

    const amount = this.amount;
    if (amount > 0 && amount < 0.000000001) {
      this.isAmountValid = false;
      return;
    }

    console.log('== 3 ==');

    if (this.amount === 0) {
      this.isAmountValid = false;
      return;
    }

    console.log('== 4 ==');


    const total = (amount + this.transactionFee);
    // console.log('-- Total: ', total);

    if (total > Number(this.account.balance)) {
      this.isAmountValid = false;
      this.amountMsg = 'Insuficient balance';
      return;
    }

    console.log('== 5 ==');

    // if validation success show modal

    let modalResult: any;

    const modalDetail = await this.modalController.create({
      component: SenddetailPage,
      componentProps: {
        trxFee: this.transactionFee,
        trxAmount: Number(this.amount),
        trxBalance: this.account.balance,
        trxSender: this.account.address,
        trxRecipient: this.recipientAddress,
        trxCurrencyRate: this.currencyRate,
        IsEscrow: this.isAdvance,
        escApproverAddress: this.escrowApprover,
        escCommission: this.escrowCommision,
        escTimeout: this.escrowTimout,
        escInstruction: this.escrowInstruction
      }
    });

    console.log('== 6 ==');

    modalDetail.onDidDismiss().then((dataReturned) => {
      if (dataReturned) {
        modalResult = dataReturned.data;
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

  sanitizeInput() {
    this.escrowInstruction = sanitizeString(this.escrowInstruction);
  }

  async sendMoney(pin: string) {

    // show loading bar
    const loading = await this.loadingController.create({
      message: 'Please wait, submiting!',
      duration: 50000
    });

    await loading.present();



    let data: SendMoneyInterface = {
      sender: this.account.address,
      recipient: sanitizeString(this.recipientAddress),
      fee: this.transactionFee,
      amount: this.amount,
    };

    if (this.isAdvance) {

      data  = {
        sender: this.account.address,
        recipient: sanitizeString(this.recipientAddress),
        fee: this.transactionFee,
        amount: this.amount,
        approverAddress: this.escrowApprover,
        commission: this.escrowCommision,
        timeout: this.escrowTimout,
        instruction: sanitizeString(this.escrowInstruction)
      };
    }

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
