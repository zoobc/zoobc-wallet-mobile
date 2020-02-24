import { Component, Inject, OnInit } from '@angular/core';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import {
  MenuController,
  ModalController
} from '@ionic/angular';

import { TransactionService } from 'src/app/Services/transaction.service';
import { TransactionFeesService } from 'src/app/Services/transaction-fees.service';
import { publicKeyToAddress, base64ToByteArray, makeShortAddress } from 'src/app/Helpers/converters';
import { QrScannerService } from 'src/app/Pages/qr-scanner/qr-scanner.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AccountService } from 'src/app/Services/account.service';
import { BytesMaker } from 'src/app/Helpers/BytesMaker';
import { GetAccountBalanceResponse } from 'src/app/Grpc/model/accountBalance_pb';
import { ActiveAccountService } from 'src/app/Services/active-account.service';
import { SenddetailPage } from 'src/app/Pages/send-coin/modals/senddetail/senddetail.page';
import { EnterpinsendPage } from 'src/app/Pages/send-coin/modals/enterpinsend/enterpinsend.page';
import { TrxstatusPage } from 'src/app/Pages/send-coin/modals/trxstatus/trxstatus.page';
import { TranslateService } from '@ngx-translate/core';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { Currency, CurrencyService } from 'src/app/Services/currency.service';
import { environment } from 'src/environments/environment';
import { CurrencyComponent } from 'src/app/Components/currency/currency.component';
import { COIN_CODE, TRX_FEE_LIST } from 'src/environments/variable.const';


interface TrxFee {
  name: string;
  fee: number;
}

type AccountBalanceList = GetAccountBalanceResponse.AsObject;

@Component({
  selector: 'app-send-coin',
  templateUrl: 'send-coin.page.html',
  styleUrls: ['send-coin.page.scss']
})

export class SendCoinPage implements OnInit {

  rootPage: any;
  status: any;
  activeAccount: any;
  account: any;
  recipient: any;
  amount = 0;
  amountSecond = 0;
  amountTemp = 0;
  trxFee = "0.001";
  customfee: number;
  allFees =  TRX_FEE_LIST;
  isAdvance = false;
  isAmountValid = true;
  isFeeValid = true;
  isCustomFeeValid = true;
  isRecipientValid = true;
  isBalanceValid = true;
  accountName = '';
  recipientMsg = '';
  amountMsg = '';
  allAccounts = [];
  errorMsg: string;
  customeChecked: boolean;
  private connectionText = '';

  public currencyRate: Currency = {
    name: 'USD',
    value: environment.zbcPriceInUSD,
  };

  public isLoadingBalance = true;
  public isLoadingRecentTx = true;
  public isLoadingTxFee = false;
  public priceInUSD: number;
  public primaryCurr = COIN_CODE;
  public secondaryCurr: string;


  constructor(
    @Inject('nacl.sign') private sign: any,
    private transactionService: TransactionService,
    private accountService: AccountService,
    private activeAccountService: ActiveAccountService,
    private toastController: ToastController,
    private menuController: MenuController,
    private qrScannerService: QrScannerService,
    private router: Router,
    private trxFeeService: TransactionFeesService,
    private currencyService: CurrencyService,
    public addressbookService: AddressBookService,
    private translateService: TranslateService,
    private modalController: ModalController,
    public alertController: AlertController,
    private activeRoute: ActivatedRoute,
    public loadingController: LoadingController
  ) {
    this.getActiveAccount();
    this.activeAccountService.accountSubject.subscribe({
      next: v => {
        console.log('==========v:', v);
        this.account = v;
        this.account.address = this.accountService.getAccountAddress(v);
        this.account.shortadress = makeShortAddress(this.account.address);
        this.getAccountBalance(this.account.address);
      }
    });

    this.addressbookService.addressSubject.subscribe({
      next: v => {
        console.log('===== address Subject subscrive ', v);
        this.recipient = v;
      }
    });

    this.activeAccountService.recipientSubject.subscribe({
      next: v => {
        console.log('===== recipient Subject subscrive ', v);
        this.recipient = v;
      }
    });

    // if currency changed
    this.currencyService.currencySubject.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      this.secondaryCurr = rate.name;
    });

    this.priceInUSD = this.currencyService.getPriceInUSD();
    console.log("===== loading consturctro ==");
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

    console.log("======  Primary currrency: ", this.primaryCurr);

    this.convertAmount();
  }

  ngOnInit() {
    console.log('=== on ngOnInit: ');
    this.loadData();
    
  }

  loadData() {
    this.getRecipientFromScanner();
    this.createTransactionFees();
    this.currencyRate = this.currencyService.getRate();
    this.secondaryCurr = this.currencyRate.name;
  }

  openMenu() {
    this.menuController.open('mainMenu');
  }

  openListAccount(arg: string) {
    console.log('==== arg send coin:', arg);
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
          handler: (val) => {
            console.log('Confirm Cancel', val);
          }
        }, {
          text: 'Ok',
          handler: (val) => {
            console.log('Confirm Ok', val);
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
      cssClass: "modal-fullscreen"
    });

    currencyModal.onDidDismiss().then((returnedData) => {
      if (returnedData && returnedData.data !== '-') {
        const currCode = returnedData.data;
        this.currencyService.setActiveCurrency(currCode);
      }
    });

    return await currencyModal.present();
  }

  createTransactionFees() {
    //this.isLoadingTxFee = true;
    // this.trxFeeService.readTrxFees().subscribe(data => {
    //   this.allFees = data.map(e => {
    //     return {
    //       id: e.payload.doc.id,
    //       name: e.payload.doc.data()['name'],
    //       fee: e.payload.doc.data()['fee']
    //     };
    //   });
    //   console.log(" == all trxees:", this.allFees);
      
    //   this.trxFee = this.allFees[0].fee.toString();
    //   console.log(" ==  trxFee:", this.trxFee);

    //   this.isLoadingTxFee = false;
    // });

    
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
    console.log('Reloading data ....');
    this.showLoading();
    this.loadData();

    setTimeout(() => {
      event.target.complete();
    }, 5000);

  }

  async getActiveAccount() {
    await this.accountService.getActiveAccount().then(acc => {
      console.log('==============ACC:', acc);
      this.account = acc;
      this.account.address = this.accountService.getAccountAddress(acc);
      this.account.shortadress = makeShortAddress(this.account.address);
      this.getAccountBalance(this.account.address);
    });
  }

  async getAccountBalance(addr: string) {
    this.isLoadingBalance = true;
    const date1 = new Date();
    await this.transactionService.getAccountBalance(addr).then((data: AccountBalanceList) => {
      if (data.accountbalance && data.accountbalance.spendablebalance) {
        const blnc = Number(data.accountbalance.spendablebalance) / 1e8;
        this.account.balance = blnc;
      }
    }).catch((error) => {
      console.log('===== eror', error);
      const date2 = new Date();
      const diff = date2.getTime() - date1.getTime();
      console.log('== diff: ', diff);

      // all SubConns are in TransientFailure
      if (error === 'error: account not found') {
        // do something here
        this.errorMsg = '';
      } else if (error === 'Response closed without headers') {
        if (diff < 5000) {
          this.errorMsg = 'Please check internet connection!';
        } else {
          this.errorMsg = 'Fail connect to services, please try again later!';
        }
      } else if (error === 'all SubConns are in TransientFailure') {
        this.errorMsg = '';
      } else {
        this.errorMsg = '';
      }
      this.account.balance = 0;
    }).finally(() => {
      this.isLoadingBalance = false;
      console.log('===== BALANCE:', this.account.balance);
      // TODO REMOVE THIS
      // this.account.balance = 3000000000 / 1e8;
    });
  }


  validateCustomFee() {
    if (this.customfee && this.customfee > 0) {
      this.isCustomFeeValid = true;
    } else {
      this.isCustomFeeValid = false;
    }
    console.log('==== customfee: ', this.customfee);
  }


  convertAmount() {

    console.log("==== Primary curr: ", this.primaryCurr);

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
      this.amountMsg = 'Amount required!';
      this.isAmountValid = false;
      return;
    }

    this.amountMsg = this.translateService.instant('Amount required!');
    if (this.isAmountValid && isNaN(this.amount)) {
      this.isAmountValid = false;
      return;
    }

    if (this.isAmountValid && this.amount <= 0) {
      this.isAmountValid = false;
      return;
    }

    if (!this.isLoadingBalance) {
  
      if (this.isAmountValid && (this.amount + this.trxFee) > this.account.balance) {
        this.amountMsg = this.translateService.instant('Insufficient balance');
        this.isAmountValid = false;
        return;
      }
    }

  }


  validateRecipient() {
    this.isRecipientValid = true;
    this.recipientMsg = this.translateService.instant('Address is not valid!');
    if (!this.recipient) {
      this.isRecipientValid = false;
      return;
    }

    if (this.isRecipientValid && this.recipient.length !== 44) {
      this.isRecipientValid = false;
      return;
    }

    if (this.isRecipientValid) {
      const addressBytes = base64ToByteArray(this.recipient);
      if (this.isRecipientValid && addressBytes.length !== 33) {
        this.isRecipientValid = false;
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
  }

  async inputPIN() {

    const pinmodal = await this.modalController.create({
      component: EnterpinsendPage,
      componentProps: {

      }
    });


    pinmodal.onDidDismiss().then((returnedData) => {
      console.log(returnedData);
      if (returnedData && returnedData.data === 1) {
        this.sendMoney();
      }
    });
    return await pinmodal.present();
  }

  getRecipientFromScanner() {
    this.activeRoute.queryParams.subscribe(params => {
      if (params && params.jsonData) {
        let json = JSON.parse(params.jsonData);
        this.recipient = json.address;
        this.amountTemp = Number(json.amount);
        this.amountSecond = this.amountTemp * this.priceInUSD * this.currencyRate.value;
        console.log('== From: ', this.recipient);
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

    if (!this.trxFee) {
      this.isFeeValid = false;
    }

    if (Number(this.trxFee) < 0) {
      this.isFeeValid = false;
    }

    if (!this.amount || !this.recipient || !this.isRecipientValid || !this.isAmountValid || !this.isFeeValid) {
      return;
    }


    const fee = this.trxFee;
    const amount = this.amount;
    const dest = this.recipient;

    if (amount > 0 && amount < 0.000000001) {
      this.isAmountValid = false;
      return;
    }

    if (this.amount === 0) {
      this.isAmountValid = false;
      return;
    }


    const total = (Number(amount) + Number(fee));
    console.log('-- Total: ', total);

    if (total > Number(this.account.balance)) {
      this.isAmountValid = false;
      this.amountMsg = 'Insuficient balance';
      return;
    }

    // if validation success show modal

    let modalResult: any;

    const modalDetail = await this.modalController.create({
      component: SenddetailPage,
      componentProps: {
        trxFee: this.trxFee,
        trxAmount: Number(this.amount),
        trxBalance: this.account.balance,
        trxSender: this.account.address,
        trxRecipient: this.recipient,
        trxCurrencyRate: this.currencyRate
      }
    });

    modalDetail.onDidDismiss().then((dataReturned) => {
      if (dataReturned) {
        modalResult = dataReturned.data;
        if (dataReturned.data === 1) {
          console.log('==  detail accepted');
          this.inputPIN();
        } else {
          console.log('==  detail closed');
        }
      }
    });

    return await modalDetail.present();
  }

  async sendMoney() {

    // show loading bar
    const loading = await this.loadingController.create({
      message: 'Please wait, submiting!',
      duration: 50000
    });
    await loading.present();

    const { derivationPrivKey: accountSeed } = this.account.accountProps;
    console.log('this.account.accountProps: ', this.account.accountProps);
    const { publicKey, secretKey } = this.sign.keyPair.fromSeed(accountSeed);

    const sender = Buffer.from(publicKeyToAddress(publicKey), 'utf-8');
    const recepient = Buffer.from(this.recipient, 'utf-8');
    const amount = this.amount * 1e8;
    const fee = Number(this.trxFee) * 1e8;
    const timestamp = Math.trunc(Date.now() / 1000);

    const bytes = new BytesMaker(129);
    // transaction type
    bytes.write4bytes(1);
    // version
    bytes.write1Byte(1);
    // timestamp
    bytes.write8Bytes(timestamp);
    // sender address length
    bytes.write4bytes(44);
    // sender address
    bytes.write44Bytes(sender);
    // recepient address length
    bytes.write4bytes(44);
    // recepient address
    bytes.write44Bytes(recepient);
    // tx fee
    bytes.write8Bytes(fee);
    // tx body length
    bytes.write4bytes(8);
    // tx body (amount)
    bytes.write8Bytes(amount);

    const signature = this.sign.detached(bytes.value, secretKey);

    const bytesWithSign = new BytesMaker(197);

    // copy to new bytes
    bytesWithSign.write(bytes.value, 129);
    // set signature type
    bytesWithSign.write4bytes(0);
    // set signature
    bytesWithSign.write(signature, 64);

    console.log(bytesWithSign.value);


    await this.transactionService.postTransaction(
      bytesWithSign.value
    ).then((resolveTx) => {
      console.log('========= response from grpc: ', resolveTx);
      if (resolveTx) {
        this.recipient = '';
        this.amount = 0;

        this.showSuccessMessage();
        return;
      }
    }
    ).catch((error) => {
      console.log('==== Have eroor when submiting:', error);
      this.showErrorMessage(error);
    }
    ).finally(() => {
      loading.dismiss();
    });


    //loading.dismiss();

  }
  async showErrorMessage(error) {
    const modal = await this.modalController.create({
      component: TrxstatusPage,
      componentProps: {
        msg: error,
        status: false
      }
    });

    modal.onDidDismiss().then((returnedData) => {
      console.log(returnedData);
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

    modal.onDidDismiss().then((returnedData) => {
      console.log(returnedData);
    });

    return await modal.present();
  }

  switchAccount(accounts: any) {
    console.log('=== accounts: ', this.account);
    this.isAmountValid = true;
    this.isRecipientValid = true;
    this.amount = null;
  }

  changeFee() {
    //this.fee = arg;
    console.log("==== trxFee: ", this.trxFee);
    if (Number(this.trxFee) < 0) {
      this.customeChecked = true;
      this.customfee = this.allFees[0].fee;
    } else {
      this.customeChecked = false;
    }
    console.log('======= customeChecked: ', this.customeChecked);
  }

  scanQrCode() {
    this.router.navigateByUrl('/qr-scanner');
    this.qrScannerService.listen().subscribe((jsonData: string) => {
      let data = JSON.parse(jsonData);
      this.recipient = data.address;
      this.amountTemp = Number(data.amount);
      this.amountSecond = this.amountTemp * this.priceInUSD * this.currencyRate.value;
    });
  }

  goDashboard() {
    this.router.navigate(['/tabs/dashboard']);
  }

  confirmSend() {
    this.router.navigate(['sendconfirm']);
  }

  openAddresses() {
    this.router.navigateByUrl('/address-book');
  }

  submit() {
    console.log('----- form submited ----');
  }
}
