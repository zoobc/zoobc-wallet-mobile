import { Component, Inject } from '@angular/core';
import { ToastController, MenuController } from '@ionic/angular';
import { GRPCService } from 'src/services/grpc.service';
import { SendMoneyTx } from 'src/helpers/serializers';
import { addressToPublicKey } from 'src/helpers/converters';
import { Storage } from '@ionic/storage';
import { QrScannerService } from 'src/app/qr-scanner/qr-scanner.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-send',
  templateUrl: 'tab-send.page.html',
  styleUrls: ['tab-send.page.scss']
})
export class TabSendPage {
  rootPage: any;
  status: any;
  register: any;
  account: any
  sender: any;
  recipient: any;
  amount: any;
  fee: any

  constructor(
    private storage: Storage,
    @Inject("nacl.sign") private sign: any,
    private grpcService: GRPCService,
    private toastController: ToastController,
    private menuController: MenuController,
    private qrScannerSrv: QrScannerService,
    private router: Router
  ) {
    // this.sender = this.getAddress();
  }

  openMenu() {
    this.menuController.open("mainMenu")
  }

  async getAddress() {
    this.account = await this.storage.get('active_account')
    this.sender = this.account.address
  }

  async sendMoney() {
    const { derivationPrivKey: accountSeed } = this.account
    const { publicKey, secretKey } = this.sign.keyPair.fromSeed(accountSeed)

    const balance = await this.grpcService.getAccountBalance()

    if (balance > (this.account + this.fee)) {
      const tx = new SendMoneyTx();
      tx.senderPublicKey = publicKey;
      tx.recipientPublicKey = addressToPublicKey(this.recipient);
      tx.amount = this.amount;
      tx.fee = this.fee;
      tx.timestamp = Date.now() / 1000;
      const txBytes = tx.toBytes();

      const signature = this.sign.detached(txBytes, secretKey)
      txBytes.set(signature, 123);

      const resolveTx = await this.grpcService.postTransaction(txBytes)

      console.log("resolveTx", resolveTx)
      if (resolveTx) {
        this.transactionToast('Money Sent')
      }
    } else {
      this.transactionToast('Balance not enough')
    }
  }

  async transactionToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  ionViewWillEnter() {
    this.getAddress()
  }

  scanQrCode() {
    this.router.navigateByUrl('/qr-scanner')

    this.qrScannerSrv.listen().subscribe((str: string) => {
      this.recipient = str;
    })
  }
}
