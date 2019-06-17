import { Component, Inject } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SendMoneyTx } from 'src/helpers/serializers';
import { addressToPublicKey } from 'src/helpers/converters';
import { GrpcapiService } from 'src/services/grpc.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {
  account: any
  sender: any;
  recipient: any;
  amount: any;
  fee: any

  constructor(
    private storage: Storage,
    @Inject("nacl.sign") private sign: any,
    private grpcService: GrpcapiService,
    private toastController: ToastController
  ){
    // this.sender = this.getAddress();
  }


  async getAddress(){
    this.account = await this.storage.get('active_account')
    this.sender = this.account.address
  }

  async sendMoney() {
    console.log("send money function running")
    const { derivationPrivKey: accountSeed } = this.account
    const { publicKey, secretKey } = this.sign.keyPair.fromSeed(accountSeed)

    const tx = new SendMoneyTx();
    tx.senderPublicKey = publicKey;
    tx.recipientPublicKey = addressToPublicKey(this.recipient);
    tx.amount = 1;
    tx.fee = 1;
    tx.timestamp = Date.now() / 1000;
    const txBytes = tx.toBytes();

    const signature = this.sign.detached(txBytes, secretKey)
    txBytes.set(signature, 123);

    const resolveTx = await this.grpcService.postTransaction(txBytes)

    console.log("resolveTx", resolveTx)
    if(resolveTx) {
      this.transactionToast()
    }
  }

  async transactionToast() {
    const toast = await this.toastController.create({
      message: 'Money Sent',
      duration: 2000
    });
    toast.present();
  }

  ionViewWillEnter() {
    this.getAddress()
  }

}
