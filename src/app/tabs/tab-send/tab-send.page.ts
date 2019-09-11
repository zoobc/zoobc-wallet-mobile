import { Component, Inject } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';

import {
  ToastController,
  MenuController,
  ModalController
} from '@ionic/angular';
import { GRPCService } from 'src/services/grpc.service';
import { publicKeyToAddress } from 'src/helpers/converters';
import { Storage } from '@ionic/storage';
import { QrScannerService } from 'src/app/qr-scanner/qr-scanner.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/services/account.service';
import { AddressBookModalComponent } from './address-book-modal/address-book-modal.component';
import { BytesMaker } from 'src/helpers/BytesMaker';

@Component({
  selector: 'app-tab-send',
  templateUrl: 'tab-send.page.html',
  styleUrls: ['tab-send.page.scss']
})
export class TabSendPage {
  rootPage: any;
  status: any;
  register: any;
  account: any;
  sender: any;
  recipient: any;
  amount: any;
  fee: any;

  constructor(
    private storage: Storage,
    @Inject('nacl.sign') private sign: any,
    private grpcService: GRPCService,
    private toastController: ToastController,
    private accountService: AccountService,
    private menuController: MenuController,
    private qrScannerSrv: QrScannerService,
    private router: Router,
    private modalController: ModalController,
    public alertController: AlertController,
    public loadingController: LoadingController
  ) {
  }

  openMenu() {
    this.menuController.open('mainMenu');
  }

  async getAddress() {
    this.account = await this.storage.get('active_account');
    this.sender = this.accountService.getAccountAddress(this.account);
  }

  shortAddress(addrs: string) {
    return addrs.substring(1, 10) + '...' +  addrs.substring(addrs.length - 10, addrs.length);
  }

  async inputPIN() {
    const alert = await this.alertController.create({
      header: 'Input your PIN!',
      inputs: [
        {
          name: 'pin',
          type: 'password',
          placeholder: '6 digits number',
          value: '123456'
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
          handler: () => {
            console.log('Confirm Ok');
            this.sendMoney();
          }
        }
      ]
    });

    await alert.present();
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirmation!',
      message: '<div>From:</br><strong>' + this.shortAddress(this.sender) + '</strong></br></br>'
      + 'To:</br><strong>' + this.shortAddress(this.recipient) + '</strong></br></br>'
      + 'Amount:</br><strong>' + this.amount + '</strong></br></br>'
      + 'Fee:</br><strong>' + this.fee + '</strong></br></br>'
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
          text: 'Okay',
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
    const { derivationPrivKey: accountSeed } = this.account.accountProps;
    console.log('this.account.accountProps: ', this.account.accountProps);
    const { publicKey, secretKey } = this.sign.keyPair.fromSeed(accountSeed);

    // const balance = await this.grpcService.getAccountBalance();

    // if (balance > this.account + this.fee) {
    //   const tx = new SendMoneyTx();
    //   tx.senderPublicKey = publicKey;
    //   tx.recipientPublicKey = addressToPublicKey(this.recipient);
    //   tx.amount = this.amount;
    //   tx.fee = this.fee;
    //   tx.timestamp = Date.now() / 1000;
    //   const txBytes = tx.toBytes();

    //   const signature = this.sign.detached(txBytes, secretKey);
    //   txBytes.set(signature, 123);

    //   const resolveTx = await this.grpcService.postTransaction(txBytes);

    //   if (resolveTx) {
    //     this.transactionToast('Money Sent');
    //   }
    // } else {
    //   this.transactionToast('Balance not enough');
    // }

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


    // show loading bar
    const loading = await this.loadingController.create({
      message: 'Please wait, submiting!',
      duration: 5000
    });
    await loading.present();

    const resolveTx = await this.grpcService.postTransaction(
      bytesWithSign.value
    );


    console.log('========= response from grpc: ',  resolveTx);

    if (resolveTx) {
      this.transactionToast('Money Sent');
      this.recipient = '';
      this.amount = 0;
      this.fee = 0;
    }
    loading.dismiss();

  }

  async transactionToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  ionViewWillEnter() {
    this.getAddress();
  }

  scanQrCode() {
    this.router.navigateByUrl('/qr-scanner');

    this.qrScannerSrv.listen().subscribe((str: string) => {
      this.recipient = str;
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

  submit() {}
}
