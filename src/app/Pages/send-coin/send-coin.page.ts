import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  AlertController,
  NavController} from '@ionic/angular';
import { MenuController, ModalController } from '@ionic/angular';
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
import zoobc, { SendMoneyInterface } from 'zbc-sdk';
import { calculateMinFee } from 'src/Helpers/utils';
import { Approver } from 'src/app/Interfaces/approver';
import { Currency } from 'src/app/Interfaces/currency';
import { TransactionService } from 'src/app/Services/transaction.service';
import { AuthService } from 'src/app/Services/auth-service';
import { Network } from '@ionic-native/network/ngx';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { addressFormatValidator } from 'src/Helpers/validators';

@Component({
  selector: 'app-send-coin',
  templateUrl: 'send-coin.page.html',
  styleUrls: ['send-coin.page.scss']
})
export class SendCoinPage implements OnInit {
  optionFee = '';
  approvers = [];
  rootPage: any;
  status: any;
  account: Account;
  senderAddress: string;
  transactionFee: number;
  withEscrow: boolean;
  allFees = this.trxService.transactionFees(TRANSACTION_MINIMUM_FEE);
  accountName: string;
  allAccounts = [];
  errorMsg: string;
  // private connectionText = '';
  public currencyRate: Currency = {
    name: CONST_DEFAULT_CURRENCY,
    value: environment.zbcPriceInUSD
  };

  alertConnectionTitle = '';
  alertConnectionMsg = '';
  networkSubscription = null;
  conversionValue = {
    amount: {
      ZBC: 0,
      USD: 0
    },
    fee: {
      ZBC: this.allFees[0].fee,
      USD: 0
    }
  };

  public isLoadingBalance = true;
  public isLoadingRecentTx = true;
  public isLoadingTxFee = false;
  public balanceInUSD: number;
  public primaryCurr = COIN_CODE;
  public secondaryCurr: string;
  private minimumFee = TRANSACTION_MINIMUM_FEE;
  isLoadingBlockHeight: boolean;
  blockHeight: number;
  recipientName: string;
  escrowApproverName: string;
  scanForWhat: string;

  sendForm = new FormGroup({
    recipientAddress: new FormControl('', [Validators.required, addressFormatValidator]),
    amount: new FormControl(0, [Validators.required, Validators.min(0.00000001)]),
    fee: new FormControl(this.allFees[0].fee, [Validators.required, Validators.min(this.minimumFee)]),
    escrow: new FormGroup({
      escrowApprover: new FormControl(''),
      escrowCommision: new FormControl(0),
      escrowTimeout: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(720)]),
      escrowInstruction: new FormControl(''),
    })
  });

  submitted = false;
  priceInUSD: number;

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
    private trxService: TransactionService,
    private network: Network,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {
    this.qrScannerService.qrScannerSubject.subscribe(address => {
      this.getScannerResult(address);
    });

    this.accountService.senderSubject.subscribe((account: Account) => {
      this.changeAccount(account);
    });

    this.addressbookService.recipientSubject.subscribe({
      next: address => {
        this.sendForm.controls.recipientAddress.setValue(address.address);
        this.recipientName = address.name;
      }
    });

    this.addressbookService.approverSubject.subscribe({
      next: address => {
        this.sendForm.get('escrow').get('escrowApprover').setValue(address.address);
        this.escrowApproverName = address.name;
      }
    });

    this.accountService.recipientSubject.subscribe({
      next: recipient => {
        this.sendForm.controls.recipientAddress.setValue(recipient.address);
        this.recipientName = recipient.name;
      }
    });

    this.accountService.approverSubject.subscribe({
      next: approver => {
        this.sendForm.get('escrow').get('escrowApprover').setValue(approver.address);
        this.escrowApproverName = approver.name;
      }
    });

    this.currencyService.currencySubject.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      this.secondaryCurr = rate.name;
    });

    this.loadAccount();
  }

  get recipientAddress() {
    return this.sendForm.get('recipientAddress');
  }

  get amount() {
    return this.sendForm.get('amount');
  }

  get fee() {
    return this.sendForm.get('fee');
  }

  get escrow() {
    return this.sendForm.get('escrow');
  }

  get escrowApprover() {
    return this.sendForm.get('escrow').get('escrowApprover');
  }

  get escrowCommision() {
    return this.sendForm.get('escrow').get('escrowCommision');
  }

  get escrowTimeout() {
    return this.sendForm.get('escrow').get('escrowTimeout');
  }

  get escrowInstruction() {
    return this.sendForm.get('escrow').get('escrowInstruction');
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

    this.onAmountChange();
    this.onFeeChange();
  }

  async ngOnInit() {
    this.approvers = [];
    this.loadData();
    this.getAllAddress();
    this.getAllAccount();
    this.onFeeChange();
    this.priceInUSD = this.currencyService.getPriceInUSD();
    this.changeWithEscrow(false);
  }

  async getAllAccount() {
    const accounts = await this.accountService.allAccount();

    if (accounts && accounts.length > 0) {
      accounts.forEach((obj: { name: any; address: string }) => {
        const app: Approver = {
          name: obj.name,
          address: obj.address
        };
        this.approvers.push(app);
      });
    }
  }

  loadData() {
    this.getRecipientFromScanner();
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
          address: obj.address
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

          this.balanceInUSD = this.currencyService.convertCurrency(blnc, COIN_CODE, CONST_DEFAULT_CURRENCY);
          this.setAmountValidation();

        }
      })
      .catch(error => {
        this.errorMsg = '';
        if (error === 'Response closed without headers') {
          this.errorMsg = 'Fail connect to services, please try again!';
        }
        this.account.balance = 0;
        this.setAmountValidation();
      })
      .finally(() => (this.isLoadingBalance = false));
  }

  onAmountChange() {
    const amount = this.sendForm.get('amount').value;
    const amountCurr = this.primaryCurr;
    this.conversionValue.amount.ZBC = this.currencyService.convertCurrency(
      amount,
      amountCurr,
      COIN_CODE
    );
    this.conversionValue.amount.USD = this.currencyService.convertCurrency(
      amount,
      amountCurr,
      CONST_DEFAULT_CURRENCY
    );
  }

  onFeeChange() {
    const fee = this.sendForm.get('fee').value;
    const feeCurr = this.primaryCurr;
    this.conversionValue.fee.ZBC = this.currencyService.convertCurrency(
      fee,
      feeCurr,
      COIN_CODE
    );
    this.conversionValue.fee.USD = this.currencyService.convertCurrency(
      fee,
      feeCurr,
      CONST_DEFAULT_CURRENCY
    );

    this.setAmountValidation();
  }

  onEscrowTimeoutChange() {

    this.minimumFee = calculateMinFee(this.escrowTimeout.value);

    this.setFeeValidation();
    this.setAmountValidation();
  }

  onCommisionChange() {
    this.setAmountValidation();
  }

  setAmountValidation() {
    this.amount.setValidators([Validators.required, Validators.min(0.00000001),
      Validators.max(this.account.balance - (this.minimumFee > this.conversionValue.fee.ZBC ?
        this.minimumFee : this.conversionValue.fee.ZBC)
        - this.escrowCommision.value)]
        );
    this.amount.updateValueAndValidity();
  }

  setFeeValidation() {
    this.fee.setValidators([Validators.required, Validators.min(this.minimumFee)]);
    this.fee.updateValueAndValidity();
  }

  addEscrowValidation() {
    this.escrow.get('escrowApprover').setValidators([Validators.required, addressFormatValidator]);
    this.escrow.get('escrowCommision').setValidators([Validators.required, Validators.min(0.00000001)]);
    this.escrow.get('escrowTimeout').setValidators([Validators.required, Validators.min(1), Validators.max(720)]);
    this.escrow.get('escrowInstruction').setValidators(Validators.required);

    this.escrowUpdateValueAndValidity();
  }

  removeEscrowValidation() {
    this.escrow.get('escrowApprover').clearValidators();
    this.escrow.get('escrowCommision').clearValidators();
    this.escrow.get('escrowTimeout').clearValidators();
    this.escrow.get('escrowInstruction').clearValidators();

    this.escrowUpdateValueAndValidity();
  }

  escrowUpdateValueAndValidity() {
    this.escrow.get('escrowApprover').updateValueAndValidity();
    this.escrow.get('escrowCommision').updateValueAndValidity();
    this.escrow.get('escrowTimeout').updateValueAndValidity();
    this.escrow.get('escrowInstruction').updateValueAndValidity();
  }

  changeWithEscrow(value: boolean) {
    this.withEscrow = value;

    if (value) {
      this.addEscrowValidation();
      this.minimumFee = calculateMinFee(this.escrowTimeout.value);
    } else {
      this.removeEscrowValidation();
      this.minimumFee = TRANSACTION_MINIMUM_FEE;
    }

    this.getBlockHeight();

    this.setFeeValidation();
    this.setAmountValidation();
  }

  async inputPIN() {
    const pinmodal = await this.modalController.create({
      component: EnterpinsendPage,
      componentProps: {}
    });

    pinmodal.onDidDismiss().then(returnedData => {
      if (returnedData && returnedData.data && returnedData.data !== 0) {
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
          this.sendForm.controls.recipientAddress.setValue(result[0]);
          if (result.length > 1) {
            this.sendForm.controls.amount.setValue(result[1] ? Number(result[1]) : 0);
            this.onAmountChange();
          }
        }
      }
    });
  }

  async showConfirmation() {
    this.submitted = true;
    if (this.sendForm.valid) {
      const modalDetail = await this.modalController.create({
        component: SenddetailPage,
        componentProps: {
          trxFee: this.fee.value,
          trxAmount: this.amount.value,
          trxBalance: this.account.balance,
          trxSenderName: this.account.name,
          trxSender: this.account.address,
          trxRecipient: this.recipientAddress.value,
          trxRecipientName: this.recipientName,
          trxCurrencyRate: this.currencyRate,
          IsEscrow: this.withEscrow,
          escApproverAddress: this.escrowApprover.value,
          escApproverName: this.escrowApproverName,
          escCommission: this.escrowCommision.value,
          escTimeout: this.escrowTimeout.value,
          escInstruction: this.escrowInstruction.value
        }
      });

      modalDetail.onDidDismiss().then(dataReturned => {
        if (dataReturned) {
          if (dataReturned.data === 1) {
            this.inputPIN();
          }
        }
      });

      await modalDetail.present();
    }
  }

  async sendMoney() {
    // show loading bar
    const loading = await this.loadingController.create({
      message: 'Please wait, submiting!',
      duration: 50000
    });


    await loading.present();

    const data: SendMoneyInterface = {
      sender: this.account.address,
      recipient: (this.recipientAddress.value),
      fee: Number(this.fee.value),
      amount: this.amount.value
    };

    if (this.withEscrow) {
      data.approverAddress = this.escrowApprover.value;
      data.commission = this.escrowCommision.value;
      data.timeout = this.escrowTimeout.value;
      data.instruction = (this.escrowInstruction.value);
    }

    const childSeed = this.authSrv.keyring.calcDerivationPath(
      this.account.path
    );
    await zoobc.Transactions.sendMoney(data, childSeed)
      .then(
        (resolveTx: any) => {
          if (resolveTx) {
            this.ngOnInit();
            this.showSuccessMessage();
            this.sendForm.reset();
            this.submitted = false;
            this.withEscrow = false;
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

  async showErrorMessage(error: any) {
    const modal = await this.modalController.create({
      component: TrxstatusPage,
      componentProps: {
        message: error,
        status: false
      }
    });

    modal.onDidDismiss().then(() => {});

    return await modal.present();
  }

  async showSuccessMessage() {
    const msgSuccess = this.getTranslation('you send coins to', this.translateService, {
      amount: this.amount.value,
      recipient: this.recipientAddress.value,
      currencyValue:  this.amount.value * this.priceInUSD * this.currencyRate.value,
      currencyName: this.currencyRate.name
    });

    const modal = await this.modalController.create({
      component: TrxstatusPage,
      componentProps: {
        message: msgSuccess,
        status: true
      }
    });

    modal.onDidDismiss().then(() => {
      this.navCtrl.pop();
    });

    return await modal.present();
  }


  getTranslation(
    value: string,
    translateService: TranslateService,
    // tslint:disable-next-line:ban-types
    interpolateParams?: Object
  ) {
    let message: string;
    translateService.get(value, interpolateParams).subscribe(res => {
      message = res;
    });
    return message;
  }


  changeFee(value: string) {
    this.sendForm.controls.fee.setValue(value);
  }

  getScannerResult(arg: string) {
    const result = arg.split('||');
    if (this.scanForWhat === FOR_APPROVER) {
      this.sendForm.get('escrow').get('escrowApprover').setValue(result[0]);
      this.escrowApproverName = null;
    } else {
      this.sendForm.controls.recipientAddress.setValue(result[0]);

      this.recipientName = null;
      if (result.length > 1) {
        this.sendForm.controls.amount.setValue(result[1] ? Number(result[1]) : 0);
        this.onAmountChange();
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


  ionViewWillEnter() {
    this.networkSubscription = this.network
      .onDisconnect()
      .subscribe(async () => {
        const alert = await this.alertCtrl.create({
          header: this.alertConnectionTitle,
          message: this.alertConnectionMsg,
          buttons: [
            {
              text: 'OK'
            }
          ],
          backdropDismiss: false
        });

        alert.present();
      });

    this.translateService.get('No Internet Access').subscribe((res: string) => {
      this.alertConnectionTitle = res;
    });

    this.translateService
      .get(
        'Oops, it seems that you don\'t have internet connection. Please check your internet connection'
      )
      .subscribe((res: string) => {
        this.alertConnectionMsg = res;
      });
  }

  ionViewDidLeave() {
    if (this.networkSubscription) {
      this.networkSubscription.unsubscribe();
    }
  }
}
