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
import {
  GetAccountBalanceResponse,
  AccountBalance as AB,
} from 'src/app/grpc/model/accountBalance_pb';
import { ActiveAccountService } from 'src/app/services/active-account.service';

type AccountBalance = AB.AsObject;
type AccountBalanceList = GetAccountBalanceResponse.AsObject;

@Component({
  selector: 'app-tab-send',
  templateUrl: 'tab-send.page.html',
  styleUrls: ['tab-send.page.scss']
})
export class TabSendPage implements OnInit{
  rootPage: any;
  status: any;
  register: any;
  account: any;
  sender: any;
  recipient: any;
  amount = 0;
  fee = 0;
  balance: any;

  isAmountValid = true;
  isFeeValid = true;
  isRecipientValid = true;
  isBalanceValid = true;

  recipientMsg = '';
  amountMsg =  '';

  public accountBalance: AccountBalance;
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

    this.balance = 0;

    this.getAddress();
    this.getBalance();

    this.activeAccountSrv.accountSubject.subscribe({
       next: v => {
         this.account.accountName = v.accountName;
         this.account.address = this.accountService.getAccountAddress(v);
         this.account.shortadress = this.shortAddress(this.account.address);
         this.getBalance();
         this.getAddress();
       }
     });
  }

  openMenu() {
    this.menuController.open('mainMenu');
  }

  async getAddress() {
    this.account = await this.storage.get('active_account');
    this.sender = this.accountService.getAccountAddress(this.account);
  }

  shortAddress(addrs: string) {
    if (addrs === '') {
      return '-';
    }
    return addrs.substring(0, 10) + '...' +  addrs.substring(addrs.length - 10, addrs.length);
  }

  validateRecipient() {

    if (!this.recipient) {
      this.isRecipientValid = false;
      this.recipientMsg = 'Recipient is empty!';
    }

    if (this.isRecipientValid && this.recipient.trim().length > 44) {
      this.isRecipientValid = false;
      this.recipientMsg = 'Recipient is not valid!';
    }

    if (this.isRecipientValid && this.recipient.trim().length < 44) {
      this.isRecipientValid = false;
      this.recipientMsg = 'Recipient is not valid!';
    }

    if (this.isRecipientValid) {
      const addressBytes = base64ToByteArray(this.recipient);
      if (this.isRecipientValid && addressBytes.length !== 33) {
        this.isRecipientValid = false;
        this.recipientMsg = 'Recipient is not valid!';
      }
    }

  }

  getBalance() {
    this.isLoadingBalance = true;
    this.transactionService.getAccountBalance(this.sender).then((data: AccountBalanceList) => {
      this.accountBalance = data.accountbalance;
      this.balance = this.accountBalance.spendablebalance;
      this.isLoadingBalance = false;
    }).catch((error) => {
      this.isLoadingBalance = false;
      if (error === 'error: account not found'){
        this.balance = 0;
      } else if (error === 'Response closed without headers') {
        this.balance = 0;
      }
      this.isLoadingBalance = false;

    });
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

  ngOnInit() {
    this.isLoadingBalance = true;
    this.amount = 0;
    this.activeRoute.queryParams.subscribe(params => {
      this.recipient = JSON.parse(params.address);
      console.log('== From: ', this.recipient);
    });
    this.getAddress();
    this.getBalance();

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

    this.getBalance();

    //validate recipient
    this.validateRecipient();

    if (!this.amount) {
      this.amount = 0;
    }

    if (this.isAmountValid && isNaN(this.amount)) {
      this.isAmountValid = false;
      this.amountMsg = 'Amount is  not valid!';
    }

    if (this.isAmountValid && this.amount <= 0) {
      this.isAmountValid = false;
      this.amountMsg = 'Amount less than minimum allowed!';
    }

    if (!this.fee) {
      this.isFeeValid = false;
      this.fee = 0;
    }

    if (!this.isRecipientValid || !this.isAmountValid || !this.isFeeValid) {
      return;
    }


    const fee = this.fee;
    const amount = this.amount;
    const dest = this.recipient;

    if (amount > 0 && amount < 0.000001) {
      this.isAmountValid = false;
      this.amountMsg = 'Amount less than minimum allowed!';
      return;
    }

    if (this.amount === 0) {
      this.isAmountValid = false;
      this.amountMsg = 'Amount less than minimum allowed!';
      return;
    }

    console.log('=== Amount:', amount);
    console.log('=== Fee:', fee);
    console.log('=== Dest:', dest);
    console.log('=== Balance:', this.balance / 1e8);

    const total = (Number(amount) + Number(fee));
    console.log('-- Total: ', total);

    if (total >  Number(this.balance) / 1e8) {
      this.isAmountValid = false;
      this.amountMsg = 'Balance is not enough, balance: ' + Number(this.balance) / 1e8;
      return;
    }

    const alert = await this.alertController.create({
      cssClass: 'alert-zbc',
      header: 'Confirmation',
      message: '<div>From:</br><strong>' + this.shortAddress(this.sender) + '</strong></br></br>'
      + 'To:</br><strong>' + this.shortAddress(this.recipient) + '</strong></br></br>'
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

      console.log('========= response from grpc: ',  resolveTx);
      if (resolveTx) {
        loading.dismiss();
        this.transactionToast('Transaction Submited!');
        this.recipient = '';
        this.amount = 0;
        this.fee = 0;

        this.router.navigateByUrl('/tabs/dashboard');

        return;
      }}
    );


    loading.dismiss();

  }

  async transactionToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }

  ionViewWillEnter() {
    this.getAddress();
    this.getBalance();
  }

  scanQrCode() {
    this.router.navigateByUrl('/qr-scanner');
    this.qrScannerSrv.listen().subscribe((address: string) => {
      this.recipient = address;
    });
  }

  goDashboard() {
    this.router.navigate(['/tabs/dashboard'])
  }

  confirmSend() {
    this.router.navigate(['sendconfirm'])
  }

  openAddresses() {
    this.presentModalAddressesList();
  }

  async presentModalAddressesList() {
    const modal = await this.modalController.create({
      component: AddressBookModalComponent
    });

    modal.onDidDismiss().then((returnVal: any) => {
      if (returnVal.data.address) {
        this.recipient = returnVal.data.address;
      }
    });

    return await modal.present();
  }

  submit() {

    console.log('----- form bro ----');
  }
}
