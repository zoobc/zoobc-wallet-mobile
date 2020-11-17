import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/Interfaces/account';
import { MultisigService } from 'src/app/Services/multisig.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import {
  TRANSACTION_MINIMUM_FEE,
  CONST_DEFAULT_CURRENCY,
  COIN_CODE,
  FOR_APPROVER
} from 'src/environments/variable.const';
import { Currency } from 'src/app/Interfaces/currency';
import { AccountService } from 'src/app/Services/account.service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { environment } from 'src/environments/environment';
import {
  LoadingController,
  ModalController,
  AlertController,
  ToastController,
  MenuController,
  Platform
} from '@ionic/angular';
import { QrScannerService } from '../../../Services/qr-scanner.service';
import { CurrencyService } from 'src/app/Services/currency.service';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { TranslateService } from '@ngx-translate/core';
import { File } from '@ionic-native/file/ngx';
import { TransactionService } from 'src/app/Services/transaction.service';
import {
  calculateMinFee,
  sanitizeString,
  stringToBuffer
} from 'src/Helpers/utils';
import { base64ToByteArray } from 'src/Helpers/converters';
import zoobc, {
  SendMoneyInterface,
  generateTransactionHash,
  sendMoneyBuilder,
  isZBCAddressValid
} from 'zoobc-sdk';
import { CurrencyComponent } from 'src/app/Components/currency/currency.component';
import { TrxstatusPage } from '../../send-coin/modals/trxstatus/trxstatus.page';
import { AccountPopupPage } from '../../account/account-popup/account-popup.page';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Network } from '@ionic-native/network/ngx';
import { Approver } from 'src/app/Interfaces/approver';
import { AuthService } from 'src/app/Services/auth-service';
import { addressFormatValidator } from 'src/Helpers/validators';
import { EnterpinsendPage } from '../../send-coin/modals/enterpinsend/enterpinsend.page';
import { SenddetailPage } from '../../send-coin/modals/senddetail/senddetail.page';

@Component({
  selector: 'app-msig-create-transaction',
  templateUrl: './msig-create-transaction.page.html',
  styleUrls: ['./msig-create-transaction.page.scss']
})
// export class MsigCreateTransactionPage implements OnInit, OnDestroy {
export class MsigCreateTransactionPage implements OnInit {
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
  removeExport = false;
  createTransactionFormEnable = true;
  multisig: MultiSigDraft;

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
  accounts: any;
  txHash: string;
  isHasTransactionHash: any;

  constructor(
    private multisigServ: MultisigService,
    private router: Router,
    private file: File,
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
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private alertCtrl: AlertController,
    private trxService: TransactionService,
    private addressBookSrv: AddressBookService,
    private authSrv: AuthService,
    private network: Network
  ) {
    this.qrScannerService.qrScannerSubject.subscribe(address => {
      this.getScannerResult(address);
    });

    this.accountService.senderSubject.subscribe((account: Account) => {
      // this.changeAccount(account);
      this.loadAccount();

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

    // this.accountService.accountSubject.subscribe(() => {
    //  });

    this.addressbookService.addressSubject.subscribe({
      next: address => {
        // this.recipientAddress = address;
      }
    });

    this.addressbookService.recipientSubject.subscribe({
      next: recipient => {
        // this.recipientAddress = recipient.address;
      }
    });

    this.accountService.recipientSubject.subscribe({
      next: recipient => {
        // this.recipientAddress = recipient.address;
      }
    });

    this.currencyService.currencySubject.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      this.secondaryCurr = rate.name;
    });

    this.priceInUSD = this.currencyService.getPriceInUSD();
    this.loadData();
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

          this.balanceInUSD = this.currencyService.convertCurrency(blnc, 'ZBC', 'USD');
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
      'ZBC'
    );
    this.conversionValue.amount.USD = this.currencyService.convertCurrency(
      amount,
      amountCurr,
      'USD'
    );
  }

  onFeeChange() {
    const fee = this.sendForm.get('fee').value;
    const feeCurr = this.primaryCurr;
    this.conversionValue.fee.ZBC = this.currencyService.convertCurrency(
      fee,
      feeCurr,
      'ZBC'
    );
    this.conversionValue.fee.USD = this.currencyService.convertCurrency(
      fee,
      feeCurr,
      'USD'
    );

    this.setAmountValidation();
  }

  onEscrowTimeoutChange() {

    this.minimumFee = calculateMinFee(this.escrowTimeout.value);
    this.fee.setValue(this.minimumFee);

    this.setFeeValidation();
    this.setAmountValidation();
  }

  onCommisionChange() {
    this.setAmountValidation();
  }

  setAmountValidation() {
    let max = 0;
    if (this.account && this.account.balance >= (this.fee.value + this.escrowCommision.value)) {
        max = this.account.balance - (this.minimumFee > this.conversionValue.fee.ZBC ?
        this.minimumFee : this.conversionValue.fee.ZBC)
      - this.escrowCommision.value;
    }

    this.amount.setValidators([Validators.required, Validators.min(0.00000001),
      Validators.max(max)]
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
      recipient: sanitizeString(this.recipientAddress.value),
      fee: Number(this.fee.value),
      amount: this.amount.value
    };

    if (this.withEscrow) {
      data.approverAddress = this.escrowApprover.value;
      data.commission = this.escrowCommision.value;
      data.timeout = this.escrowTimeout.value;
      data.instruction = sanitizeString(this.escrowInstruction.value);
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
      // this.resetValidation();
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



  async next() {
    const isValid = true; // this.isFormValid();
    if (!isValid) {
      return;
    }
    if (this.multisig.signaturesInfo !== null) {
      this.createTransactionFormEnable = true;
    }
    const { signaturesInfo } = this.multisig;
    if (!this.multisig.unisgnedTransactions) {
      // this.showNextConfirmation();
      this.generateHash();
    } else if (signaturesInfo !== undefined) {
      this.router.navigate(['/msig-add-signatures']);
    } else {
      this.router.navigate(['/msig-send-transaction']);
    }
  }

  generateHash() {
    const { signaturesInfo } = this.multisig;
    this.generatedTxHash();
    // this.updateCreateTransaction();

    // aditional
    // const multisig = { ...this.multisig };
    this.multisigServ.update(this.multisig);
    // end of

    if (signaturesInfo === undefined) {
      this.router.navigate(['/msig-send-transaction']);
    } else {
      this.router.navigate(['/msig-add-signatures']);
    }
  }

  async generatedTxHash() {
    this.updateCreateTransaction();
    const { sender } = this.multisig.transaction;
    const data: SendMoneyInterface = {
      sender: this.account.address,
      recipient: sanitizeString(this.recipientAddress),
      fee: this.transactionFee,
      amount: 0 // this.amount
    };

    const account = this.accounts.find(acc => acc.address === sender);
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
            signature: stringToBuffer('')
          };
          participantAccount.push(participant);
        }
      } else {
        // tslint:disable-next-line:prefer-for-of
        for (
          let i = 0;
          i < this.multisig.multisigInfo.participants.length;
          i++
        ) {
          const participant = {
            address: this.multisig.multisigInfo.participants[i],
            signature: stringToBuffer('')
          };
          participantAccount.push(participant);
        }
      }
      const dataBuffer = sendMoneyBuilder(data);
      this.txHash = generateTransactionHash(dataBuffer);
      this.multisig.signaturesInfo = {
        txHash: this.txHash,
        participants: participantAccount
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
      amount: 0, // this.amount,
      fee: this.transactionFee,
      recipient: sanitizeString(this.recipientAddress)
    };
  }

  async exportDraft() {
    const isValid = true; // this.isFormValid();
    if (!isValid) {
      return;
    }

    if (!this.isHasTransactionHash) {
      this.generatedTxHash();
    }
    const theJSON = JSON.stringify(this.multisig);
    const blob = new Blob([theJSON], { type: 'application/JSON' });
    const pathFile = await this.getDownloadPath();

    const fileName = this.getDraftFileName();
    await this.file.createFile(pathFile, fileName, true);
    await this.file.writeFile(pathFile, fileName, blob, {
      replace: true,
      append: false
    });
    alert('File saved in Download folder with name: ' + fileName);
  }

  private getDraftFileName() {
    const currentDatetime = new Date();
    const formattedDate =
      currentDatetime.getDate() +
      '-' +
      (currentDatetime.getMonth() + 1) +
      '-' +
      currentDatetime.getFullYear() +
      '-' +
      currentDatetime.getHours() +
      '-' +
      currentDatetime.getMinutes() +
      '-' +
      currentDatetime.getSeconds();
    return 'Multisig-draft-' + formattedDate + '.json';
  }

  async getDownloadPath() {
    if (this.platform.is('ios')) {
      return this.file.documentsDirectory;
    }

    // To be able to save files on Android, we first need to ask the user for permission.
    // We do not let the download proceed until they grant access
    await this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      )
      .then(result => {
        if (!result.hasPermission) {
          return this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
          );
        }
      });

    return this.file.externalRootDirectory + '/Download/';
  }

  async showNextConfirmation() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure?',
      message:
        '<strong>You will not be able to update the form anymore</strong>!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // type here from tata hire
          }
        },
        {
          text: 'Yes, continue it!',
          handler: () => {
            this.generateHash();
          }
        }
      ]
    });

    await alert.present();
  }
}
