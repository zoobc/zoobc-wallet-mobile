import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  AlertController} from '@ionic/angular';
import { MenuController, ModalController } from '@ionic/angular';

import { base64ToByteArray } from 'src/Helpers/converters';
import { QrScannerService } from 'src/app/Services/qr-scanner.service';
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
  COIN_CODE,
  CONST_DEFAULT_CURRENCY,
  TRANSACTION_MINIMUM_FEE,
  FOR_APPROVER
} from 'src/environments/variable.const';
import { Account } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
import zoobc, { SendMoneyInterface } from 'zoobc-sdk';
import { calculateMinFee, sanitizeString } from 'src/Helpers/utils';
import { makeShortAddress } from 'src/Helpers/converters';
import { Approver } from 'src/app/Interfaces/approver';
import { Currency } from 'src/app/Interfaces/currency';
import { TransactionService } from 'src/app/Services/transaction.service';
import { AuthService } from 'src/app/Services/auth-service';

@Component({
  selector: 'app-send-coin',
  templateUrl: 'send-coin.page.html',
  styleUrls: ['send-coin.page.scss']
})
export class SendCoinPage implements OnInit {
  approvers = [];
  rootPage: any;
  status: any;
  account: Account;
  recipientAddress: string;
  senderAddress: string;
  amount: number;
  amountSecond: number;
  amountTemp: number;
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
  isBalanceValid = true;
  accountName: string;
  recipientMsg = '';
  amountMsg = '';
  allAccounts = [];
  errorMsg: string;
  customeChecked: boolean;
  // private connectionText = '';
  public currencyRate: Currency = {
    name: CONST_DEFAULT_CURRENCY,
    value: environment.zbcPriceInUSD
  };

  public isLoadingBalance = true;
  public isLoadingRecentTx = true;
  public isLoadingTxFee = false;
  public priceInUSD: number;
  public primaryCurr = COIN_CODE;
  public secondaryCurr: string;

  escrowApprover: string;
  escrowCommision: number;
  escrowTimout: number;
  escrowInstruction: string;
  private minimumFee = TRANSACTION_MINIMUM_FEE;
  isLoadingBlockHeight: boolean;
  blockHeight: number;
  isEscrowInstructionValid = true;
  isEscrowCommitionValid = true;
  isEscrowApproverValid = true;
  isEscrowTimeoutValid = true;
  recipientName: string;
  escrowApproverName: string;
  scanForWhat: string;

  constructor(
    private router: Router,
    public loadingController: LoadingController,
    private modalController: ModalController,
    public alertController: AlertController,
    private activeRoute: ActivatedRoute,
    private menuController: MenuController,
    private accountService: AccountService,
    private qrScannerService: QrScannerService,
    private currencyService: CurrencyService,
    public addressbookService: AddressBookService,
    private translateService: TranslateService,
    private addressBookSrv: AddressBookService,
    private authSrv: AuthService,
    private trxService: TransactionService
  ) {
    this.qrScannerService.qrScannerSubject.subscribe(address => {
      this.getScannerResult(address);
    });

    this.accountService.senderSubject.subscribe((account: Account) => {
      this.changeAccount(account);
    });

    this.addressbookService.recipientSubject.subscribe({
      next: address => {
        this.recipientAddress = address.address;
        this.recipientName = address.name;
      }
    });

    this.addressbookService.approverSubject.subscribe({
      next: address => {
        this.escrowApprover = address.address;
        this.escrowApproverName = address.name;
      }
    });

    this.accountService.recipientSubject.subscribe({
      next: recipient => {
        this.recipientAddress = recipient.address;
        this.recipientName = recipient.name;
      }
    });

    this.accountService.approverSubject.subscribe({
      next: approver => {
        this.escrowApprover = approver.address;
        this.escrowApproverName = approver.name;
      }
    });

    this.currencyService.currencySubject.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      this.secondaryCurr = rate.name;
    });

    this.priceInUSD = this.currencyService.getPriceInUSD();
    this.loadAccount();
  }

  validateEscCommition() {
    this.isEscrowCommitionValid = true;
    if (isNaN(this.escrowCommision)) {
      return;
    }

    if (this.escrowCommision <= 0) {
      this.isEscrowCommitionValid = false;
    }
  }

  validateInstruction() {
    this.isEscrowInstructionValid = true;
    if (!this.escrowInstruction) {
      this.isEscrowInstructionValid = false;
    }
  }

  selectApprover() {
    if (!this.isAdvance) {
      return;
    }

    if (this.escrowApprover) {
      this.isEscrowApproverValid = true;
    } else {
      this.isEscrowApproverValid = false;
    }
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
    this.approvers = [];
    this.loadData();
    this.getAllAddress();
    this.getAllAccount();
  }

  resetForm() {
    this.isRecipientValid = true;
    this.recipientAddress = '';
    this.recipientMsg = '';
    this.amountMsg = '';
    this.amountTemp = 0;
    this.amountSecond = 0;
    this.amount = 0;
    this.isAmountValid = true;
    this.escrowApprover = null;
    this.escrowCommision = null;
    this.escrowTimout = null;
    this.escrowInstruction = null;
    this.isAdvance = false;
  }

  resetValidation() {
    this.isRecipientValid = true;
    this.isAmountValid = true;
    this.isEscrowInstructionValid = true;
    this.isEscrowCommitionValid = true;
    this.isEscrowApproverValid = true;
    this.isEscrowTimeoutValid = true;
  }

  ionViewDidEnter() {
    this.amountMsg = '';
    this.isAmountValid = true;
    this.isEscrowCommitionValid = true;
  }

  async getAllAccount() {
    const accounts = await this.accountService.allAccount();

    if (accounts && accounts.length > 0) {
      accounts.forEach((obj: { name: any; address: string }) => {
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
      alladdress.forEach((obj: { name: any; address: string }) => {
        const app: Approver = {
          name: obj.name,
          address: obj.address,
          shortAddress: makeShortAddress(obj.address)
        };
        this.approvers.push(app);
      });
    }
  }

  openMenu() {
    this.menuController.open('mainMenu');
  }

  openListAccount(arg: string) {
    const navigationExtras: NavigationExtras = {
      state: {
        forWhat: arg
      }
    };
    this.router.navigate(['list-account'], navigationExtras);
  }

  async presentGetAddressOption(source: string) {
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
          label: 'Contacts',
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
        },
        {
          text: 'Ok',
          handler: val => {
            if (val === 'address') {
              this.openAddresses(source);
            } else if (val === 'account') {
              this.openListAccount(source);
            } else {
              this.scanQrCode(source);
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

    currencyModal.onDidDismiss().then(returnedData => {
      if (returnedData && returnedData.data !== '-') {
        const currCode = returnedData.data;
        this.currencyService.setActiveCurrency(currCode);
      }
    });

    return await currencyModal.present();
  }

  showLoading() {
    this.loadingController
      .create({
        message: 'Loading ...',
        duration: 2000
      })
      .then(res => {
        res.present();
      });
  }

  doRefresh(event: any) {
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

  async changeAccount(acc: Account) {
    this.account = acc;
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
    this.validateAmount();
    this.isCustomFeeValid = true;
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
    this.isEscrowTimeoutValid = true;
    if (isNaN(this.escrowTimout)) {
      return;
    }

    if (this.escrowTimout <= 0) {
      this.isEscrowTimeoutValid = false;
      return;
    }

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
      this.customfee2 =
        this.customfeeTemp * this.priceInUSD * this.currencyRate.value;
    } else {
      this.customfee =
        this.customfeeTemp / this.priceInUSD / this.currencyRate.value;
      this.customfee2 = this.customfee;
    }
  }

  convertAmount() {
    if (!this.amountTemp) {
      this.amountTemp = 0;
    }
    if (this.primaryCurr === COIN_CODE) {
      this.amount = this.amountTemp;
      this.amountSecond =
        this.amountTemp * this.priceInUSD * this.currencyRate.value;
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
      this.amountMsg = this.translateService.instant('Amount is not valid!');
      this.isAmountValid = false;
      return;
    }

    if (this.isAmountValid && this.amount < 0.00000001) {
      this.amountMsg = this.translateService.instant(
        'minimum amount is 0.00000001!'
      );
      this.isAmountValid = false;
      return;
    }

    if (this.isAmountValid && this.amount <= 0) {
      this.isAmountValid = false;
      return;
    }

    if (!this.isLoadingBalance) {
      if (
        this.isAmountValid &&
        this.amount +
          (Number(this.optionFee) >= 0
            ? Number(this.optionFee)
            : Number(this.customfeeTemp)) >
          this.account.balance
      ) {
        if (this.account.balance > 0) {
          this.amountMsg =
            this.translateService.instant(
              'Insufficient balance. The maximum amount is'
            ) +
            ' ' +
            (Number(this.account.balance) -
              (Number(this.optionFee) >= 0
                ? Number(this.optionFee)
                : Number(this.customfeeTemp))) +
            ' ZBC';
        } else {
          this.amountMsg = this.translateService.instant(
            'Insufficient balance.'
          );
        }
        this.isAmountValid = false;
        return;
      }
    }
  }

  validateApprover() {
    this.isEscrowApproverValid = true;
    if (this.escrowApprover === null || this.escrowApprover === undefined) {
      return;
    }

    if (!this.escrowApprover || this.escrowApprover === '') {
      this.isEscrowApproverValid = false;
      return;
    }


    if (this.escrowApprover) {
      if (!this.escrowApprover.toUpperCase().startsWith('ZBC')){
        this.isEscrowApproverValid = false;
        return;
      } 
    }

    const addressBytes = base64ToByteArray(this.escrowApprover);
    if (this.isEscrowApproverValid && addressBytes.length !== 49) {
      this.isEscrowApproverValid = false;
      return;
    }
  }

  shortAddress(address: string) {
    return makeShortAddress(address);
  }

  validateRecipient() {
    this.isRecipientValid = true;
    this.recipientAddress = sanitizeString(this.recipientAddress);

    if (this.recipientAddress === null || this.recipientAddress === undefined) {
      return;
    }

    if (!this.recipientAddress || this.recipientAddress === '') {
      this.isRecipientValid = false;
      this.recipientMsg = this.translateService.instant(
        'Recipient is required!'
      );
      return;
    }

    if (this.isRecipientValid) {
      if (!this.recipientAddress.toUpperCase().startsWith('ZBC')){
        this.isRecipientValid = false;
        this.recipientMsg = this.translateService.instant(
          'Address is not valid!'
        );
        return;
      } 
    }

    if (this.isRecipientValid) {
      const addressBytes = base64ToByteArray(this.recipientAddress);
      if (this.isRecipientValid && addressBytes.length !== 49) {
        this.isRecipientValid = false;
        this.recipientMsg = this.translateService.instant(
          'Address is not valid!'
        );
        return;
      }
    }
  }

  showAdvance() {
    this.getBlockHeight();
    if (!this.isAdvance) {
      this.minimumFee = TRANSACTION_MINIMUM_FEE;
    }
  }

  async inputPIN() {
    const pinmodal = await this.modalController.create({
      component: EnterpinsendPage,
      componentProps: {}
    });

    pinmodal.onDidDismiss().then(returnedData => {
      if (returnedData && returnedData.data !== 0) {
        const pin = returnedData.data;
        this.sendMoney();
      }
    });
    return await pinmodal.present();
  }

  getRecipientFromScanner() {
    this.activeRoute.queryParams.subscribe(params => {
      if (params && params.jsonData && params.jsonData.length > 0) {
        const result = params.jsonData.split('||');
        if (params.from === 'dashboard') {
          this.recipientAddress = result[0];
          if (result.length > 1) {
            this.amountTemp = Number(result[1]);
            if (result[1] !== null) {
              this.amountSecond =
                this.amountTemp * this.priceInUSD * this.currencyRate.value;
            } else {
              this.amountSecond = undefined;
            }
          }
        }
      }
    });
  }

  async showConfirmation() {
    // validate recipient
    this.isRecipientValid = true;
    this.recipientMsg = '';
    this.validateRecipient();

    // validate amount
    this.isAmountValid = true;
    this.amountMsg = '';
    this.validateAmount();
    this.transactionFee = Number(this.optionFee);

    // validate transaction fee
    if (this.customeChecked) {
      this.transactionFee = this.customfee;
    }
    this.isFeeValid = true;
    if (isNaN(this.transactionFee) || Number(this.transactionFee) <= 0) {
      this.isFeeValid = false;
    } else if (this.transactionFee < this.minimumFee) {
      this.isFeeValid = false;
      if (this.customeChecked) {
        this.isCustomFeeValid = false;
      }
    }

    // validate advance field
    if (this.isAdvance) {
      this.minimumFee = await this.getMinimumFee(this.escrowTimout);

      this.isEscrowApproverValid = true;
      if (!this.escrowApprover) {
        this.isEscrowApproverValid = false;
      }

      this.isEscrowCommitionValid = true;
      if (isNaN(this.escrowCommision) || Number(this.escrowCommision) <= 0) {
        this.isEscrowCommitionValid = false;
      }

      this.isEscrowTimeoutValid = true;
      if (isNaN(this.escrowTimout) || Number(this.escrowTimout) <= 0) {
        this.isEscrowTimeoutValid = false;
      }

      this.isEscrowInstructionValid = true;
      if (!this.escrowInstruction) {
        this.isEscrowInstructionValid = false;
      }
    }

    if (
      !this.amount ||
      !this.recipientAddress ||
      !this.isRecipientValid ||
      !this.isAmountValid ||
      !this.isFeeValid ||
      !this.isEscrowInstructionValid ||
      !this.isEscrowCommitionValid ||
      !this.isEscrowApproverValid ||
      !this.isEscrowTimeoutValid
    ) {
      return;
    }

    const amount = this.amount;
    if (amount > 0 && amount < 0.000000001) {
      this.isAmountValid = false;
      return;
    }

    if (this.amount === 0) {
      this.isAmountValid = false;
      return;
    }

    const total = amount + this.transactionFee;

    if (total > Number(this.account.balance)) {
      this.isAmountValid = false;
      this.amountMsg = 'Insuficient balance';
      return;
    }

    
    const modalDetail = await this.modalController.create({
      component: SenddetailPage,
      componentProps: {
        trxFee: this.transactionFee,
        trxAmount: Number(this.amount),
        trxBalance: this.account.balance,
        trxSenderName: this.account.name,
        trxSender: this.account.address,
        trxRecipient: this.recipientAddress,
        trxRecipientName: this.recipientName,
        trxCurrencyRate: this.currencyRate,
        IsEscrow: this.isAdvance,
        escApproverAddress: this.escrowApprover,
        escApproverName: this.escrowApproverName,
        escCommission: this.escrowCommision,
        escTimeout: this.escrowTimout,
        escInstruction: this.escrowInstruction
      }
    });

    modalDetail.onDidDismiss().then(dataReturned => {
      if (dataReturned) {
        if (dataReturned.data === 1) {
          this.inputPIN();
        }
      }
    });

    return await modalDetail.present();
  }

  sanitizeInput() {
    this.escrowInstruction = sanitizeString(this.escrowInstruction);
  }

  async sendMoney() {
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
      amount: this.amount
    };

    if (this.isAdvance) {
      data = {
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

    const childSeed = this.authSrv.keyring.calcDerivationPath(this.account.path);
    await zoobc.Transactions.sendMoney(data, childSeed)
      .then(
        (resolveTx: any) => {
          if (resolveTx) {
            this.ngOnInit();
            this.resetForm();
            this.showSuccessMessage();
            return;
          }
        },
        error => {
          this.showErrorMessage(error);
        }
      )
      .finally(() => {
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

    modal.onDidDismiss().then(() => {});

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

    modal.onDidDismiss().then(() => {
      this.resetValidation();
    });

    return await modal.present();
  }

  switchAccount() {
    this.isAmountValid = true;
    this.isRecipientValid = true;
    this.amount = null;
  }

  changeFee() {
    this.validateAmount();
    this.customeChecked = false;
    if (Number(this.optionFee) < 0) {
      this.customeChecked = true;
      this.customfeeTemp = this.allFees[0].fee;
    }
  }

  getScannerResult(arg: string) {
    const result = arg.split('||');
    if (this.scanForWhat === FOR_APPROVER) {
      this.escrowApprover = result[0];
      this.escrowApproverName = null;
    } else {
      this.recipientAddress = result[0];
      this.recipientName = null;
      if (result.length > 1) {
        this.amountTemp = Number(result[1]);
        if (result[1] !== null) {
          this.amountSecond =
            this.amountTemp * this.priceInUSD * this.currencyRate.value;
        } else {
          this.amountSecond = undefined;
        }
      }
    }
  }

  scanQrCode(arg: string) {
    this.scanForWhat = arg;
    this.router.navigateByUrl('/qr-scanner');
  }

  goDashboard() {
    this.router.navigate(['/dashboard']);
  }

  confirmSend() {
    this.router.navigate(['sendconfirm']);
  }

  openAddresses(arg: string) {
    const navigationExtras: NavigationExtras = {
      state: {
        forWhat: arg
      }
    };

    this.router.navigate(['/address-book'], navigationExtras);
  }

  async getMinimumFee(timeout: number) {
    const fee: number = calculateMinFee(timeout);
    return fee;
  }
}
