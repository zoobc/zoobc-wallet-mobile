import { Component, Inject, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth-service';
import {
  ToastController,
  MenuController,
  ModalController
} from '@ionic/angular';
import { TransactionService } from 'src/app/services/transaction.service';
import { publicKeyToAddress, base64ToByteArray } from 'src/app/helpers/converters';
import { Storage } from '@ionic/storage';
import { QrScannerService } from 'src/app/qr-scanner/qr-scanner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AddressBookModalComponent } from './address-book-modal/address-book-modal.component';
import { BytesMaker } from 'src/app/helpers/BytesMaker';
import { GetAccountBalanceResponse} from 'src/app/grpc/model/accountBalance_pb';
import { ActiveAccountService } from 'src/app/services/active-account.service';

interface AccountInfo {
  name: string;
  address: string;
  shortAddress: string;
  balance: number;
}

interface TrxFee {
  name: string;
  fee: number;
}

type AccountBalanceList = GetAccountBalanceResponse.AsObject;

@Component({
  selector: 'app-tab-send',
  templateUrl: 'tab-send.page.html',
  styleUrls: ['tab-send.page.scss']
})

export class TabSendPage implements OnInit {
  rootPage: any;
  status: any;
  activeAccount: any;
  account: any;
  recipient: any;
  amount: number;
  fee: any;

  allFees = [];

  isAmountValid = true;
  isFeeValid = true;
  isRecipientValid = true;
  isBalanceValid = true;
  accountName = '';
  recipientMsg = '';
  amountMsg = '';
  allAccounts = [];
  errorMsg: string;

  public isLoadingBalance = true;
  public isLoadingRecentTx = true;


  constructor(
    private storage: Storage,
    @Inject('nacl.sign') private sign: any,
    private transactionService: TransactionService,
    private toastController: ToastController,
    private accountService: AccountService,
    private activeAccountSrv: ActiveAccountService,
    private menuController: MenuController,
    private qrScannerSrv: QrScannerService,
    private router: Router,
    private authService: AuthService,
    private modalController: ModalController,
    public alertController: AlertController,
    private activeRoute: ActivatedRoute,
    public loadingController: LoadingController
  ) {

    // get active account
    console.log('=== on constructor: ');
    this.getActiveAccount();

    const trxFee1: TrxFee  = {
      name: 'Slow',
      fee: 0.00005
    };

    const trxFee2: TrxFee  = {
      name: 'Average',
      fee: 0.00015
    };

    const trxFee3: TrxFee  = {
      name: 'Fast',
      fee: 0.00025
    };

    this.allFees.push(trxFee1);
    this.allFees.push(trxFee2);
    this.allFees.push(trxFee3);
    this.fee = trxFee2;




    // this.activeAccountSrv.accountSubject.subscribe({
    //    next: v => {
    //      this.account.accountName = v.accountName;
    //      this.account.address = this.accountService.getAccountAddress(v);
    //      this.account.shortadress = this.makeShortAddress(this.account.address);
    //      this.getBalance();
    //      this.getActiveAccount();
    //    }
    //  });
  }

  openMenu() {
    this.menuController.open('mainMenu');
  }

  async getActiveAccount() {
    this.activeAccount = await this.accountService.getActiveAccount();
    console.log('==== activeAccount: ', this.activeAccount);
  }

  async getAllAccounts() {
    this.allAccounts = [];
    this.errorMsg = '';
    console.log('-- start: ');

    let i = 0;

    const alls = await this.accountService.getAll();
    for (const acc of alls) {
      console.log('-- urutan: ' + i);
      this.isLoadingBalance = true;

      const addr = this.accountService.getAccountAddress(acc);
      const tempAcc: AccountInfo  = {
        name: acc.accountName,
        address: addr,
        shortAddress: this.makeShortAddress(addr),
        balance: 0
      };

      await this.transactionService.getAccountBalance(addr).then((data: AccountBalanceList) => {
        if (data.accountbalance && data.accountbalance.spendablebalance) {
          const blnc = Number(data.accountbalance.spendablebalance) / 1e8;
          tempAcc.balance = blnc;
        }
      }).catch((error) => {
        if (error !== 'account not found') {
          this.errorMsg = error;
        }
        tempAcc.balance = 0;
      }).finally(() => {
        console.log('-- urutan: ' + i + '-b');
        console.log('--- acc name: ', acc.accountName);
        console.log('--- acc addr: ', addr);
        console.log('--- acc Balance: ', tempAcc.balance);
        // this.isLoadingBalance = false;
        const activeAddress = this.accountService.getAccountAddress(this.activeAccount);
        if (addr === activeAddress && acc.accountName === this.activeAccount.accountName) {
          this.account = tempAcc;
        }
        this.allAccounts.push(tempAcc);
      });
      i++;
    }

    console.log('-- end: ');
    // finaly set false
    this.isLoadingBalance = false;

  }


  makeShortAddress(addrs: string) {
    if (addrs === '' || addrs.length < 24) {
      return addrs;
    }
    return addrs.substring(0, 10) + '...' + addrs.substring(addrs.length - 10, addrs.length);
  }


  validateAmount() {
    this.isAmountValid = true;
    this.amountMsg = 'Amount is not allowed!';

    if (!this.amount) {
      this.isAmountValid = true;
      return;
      //this.amount = 0;
    }

    if (this.isAmountValid && isNaN(this.amount)) {
      this.isAmountValid = false;
    }

    if (this.isAmountValid && this.amount <= 0) {
      this.isAmountValid = false;
    }

    if (!this.isLoadingBalance) {
      console.log("== Fee:", this.fee.fee);
      console.log("== Balance:", this.account.balance);

      console.log("== amount:", this.amount);

      if (this.isAmountValid && this.account.balance > ( this.amount + this.fee.fee)) {
        this.amountMsg = 'Insufficient balance';
        this.isAmountValid = false;
      }
    }

  }

  // resetForm(){
  //   this.isRecipientValid = true;
  //   this.isAmountValid = true;
  //   this.fee = this.allFees[1];
  // }

  validateRecipient() {
    this.isRecipientValid = true;
    this.recipientMsg = 'Address is not valid!';
    if (!this.recipient) {
      this.isRecipientValid = true;
      return;
    }

    if (this.isRecipientValid && this.recipient.length !== 44) {
      this.isRecipientValid = false;
    }

    if (this.isRecipientValid) {
      const addressBytes = base64ToByteArray(this.recipient);
      if (this.isRecipientValid && addressBytes.length !== 33) {
        this.isRecipientValid = false;
      }
    }
  }

  async inputPIN() {
    const alert = await this.alertController.create({
      cssClass: 'alert-zbc',
      header: 'PIN Confirmation!',
      inputs: [
        {
          name: 'pin',
          type: 'password',
          placeholder: '6 digits number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log(JSON.stringify(data));

            if ('' === data.pin) {
              console.log('empty pin: ' + data.pin);
              this.failedToast();
              return;
            }

            if (data.pin.length < 6) {
              console.log(' pin length: ' + data.pin.length);
              this.failedToast();
              return;
            }


            if (data.pin.length > 6) {
              console.log(' pin length: ' + data.pin.length);
              this.failedToast();
              return;
            }

            console.log(data.pin);
            this.login(data);
          }
        }
      ]
    });

    await alert.present();
  }

  getRecipientFromScanner() {
    this.activeRoute.queryParams.subscribe(params => {
      if (params.address) {
        this.recipient = JSON.parse(params.address);
        console.log('== From: ', this.recipient);
      }
    });
  }

  ngOnInit() {

    this.getRecipientFromScanner();

  }

  async login(e: any) {

    const { observer, pin } = e;

    const isUserLoggedIn = await this.authService.login(pin);
    if (isUserLoggedIn) {
      this.sendMoney();
      // this.router.navigate(["tabs"]);

      setTimeout(() => {
        console.log('wait a secon');
      }, 1000);

    } else {
      setTimeout(() => {
        console.log('wait a secon');
        this.failedToast();
      }, 1000);
    }

  }

  async failedToast() {
    const toast = await this.toastController.create({
      message: 'PIN not match',
      duration: 2000
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

    if (!this.fee) {
      this.isFeeValid = false;
    }

    if (!this.amount || !this.recipient || !this.isRecipientValid || !this.isAmountValid || !this.isFeeValid) {
      return;
    }


    const fee = this.fee;
    const amount = this.amount;
    const dest = this.recipient;

    if (amount > 0 && amount < 0.000001) {
      this.isAmountValid = false;
      return;
    }

    if (this.amount === 0) {
      this.isAmountValid = false;
      return;
    }

    console.log('=== Amount:', amount);
    console.log('=== Fee:', fee);
    console.log('=== Dest:', dest);
    console.log('=== Balance:', this.account.balance / 1e8);

    const total = (Number(amount) + Number(fee));
    console.log('-- Total: ', total);

    if (total > Number(this.account.balance) / 1e8) {
      this.isAmountValid = false;
      this.amountMsg = 'Insuficient balance';
      return;
    }

    const alert = await this.alertController.create({
      cssClass: 'alert-zbc',
      header: 'Confirmation',
      message: '<div>From:</br><strong>' + this.makeShortAddress(this.account.address) + '</strong></br></br>'
        + 'To:</br><strong>' + this.makeShortAddress(this.recipient) + '</strong></br></br>'
        + 'Amount:</br><strong>' + Number(this.amount) + '</strong></br></br>'
        + 'Fee:</br><strong>' + Number(this.fee) + '</strong></br></br>'
        + 'Total:</br><strong>' + (Number(this.amount) + Number(this.fee)).toFixed(8) + '</strong></br></br>'
        + '</div>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
            this.inputPIN();
          }
        }
      ]
    });

    await alert.present();
  }

  async sendMoney() {

    // show loading bar
    const loading = await this.loadingController.create({
      message: 'Please wait, submiting!',
      duration: 5000
    });
    await loading.present();

    const { derivationPrivKey: accountSeed } = this.account.accountProps;
    console.log('this.account.accountProps: ', this.account.accountProps);
    const { publicKey, secretKey } = this.sign.keyPair.fromSeed(accountSeed);

    const sender = Buffer.from(publicKeyToAddress(publicKey), 'utf-8');
    const recepient = Buffer.from(this.recipient, 'utf-8');
    const amount = this.amount * 1e8;
    const fee = this.fee * 1e8;
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
        loading.dismiss();
        this.transactionToast('Transaction Submited!');
        this.recipient = '';
        this.amount = 0;
        this.fee = 0;

        this.router.navigateByUrl('/tabs/dashboard');

        return;
      }
    }
    );


    loading.dismiss();

  }

  myFun( accounts: any) {
    console.log('=== accounts: ', this.account );
  }

  changeFee(fee: number) {
    console.log('=== Fee: ', fee );
  }

  async transactionToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }

  ionViewWillEnter() {
    // get active account
    console.log("=== on ionViewWillEnter: ");
    this.getActiveAccount();
    this.getAllAccounts();

  }

  scanQrCode() {
    this.router.navigateByUrl('/qr-scanner');
    this.qrScannerSrv.listen().subscribe((address: string) => {
      this.recipient = address;
    });
  }

  goDashboard() {
    this.router.navigate(['/tabs/dashboard']);
  }

  confirmSend() {
    this.router.navigate(['sendconfirm']);
  }

  openAddresses() {
    this.presentModalAddressesList();
  }

  async presentModalAddressesList() {
    const modal = await this.modalController.create({
      component: AddressBookModalComponent
    });

    modal.onDidDismiss().then((returnVal: any) => {
      if (returnVal && returnVal.data && returnVal.data.address) {
        this.recipient = returnVal.data.address;
      }
    });

    return await modal.present();
  }

  submit() {

    console.log('----- form submited ----');
  }
}
