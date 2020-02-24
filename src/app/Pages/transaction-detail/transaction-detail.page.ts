import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/Interfaces/transaction';
import { ToastController, NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.page.html',
  styleUrls: ['./transaction-detail.page.scss']
})
export class TransactionDetailPage implements OnInit {
  transaction: Transaction = {
    id: null,
    address: null,
    type: null,
    sender: '',
    recipient: '',
    blockId: 0,
    amount: 0,
    height: 0,
    fee: 0,
    total: 0,
    timestamp: null
  };
  account: any;
  status: string;

  constructor(
    private toastController: ToastController,
    private navParams: NavParams,
    public modalCtrl: ModalController,
  ) {

  }

  ngOnInit() {

    console.table(' params console1 === ', this.navParams);

    if (this.navParams && this.navParams.data) {
      this.transaction = this.navParams.data.transaction;
      this.account = this.navParams.data.account;
      this.status = this.navParams.data.status;
    }

    if (this.transaction.type === 'send') {
      this.transaction.sender = this.account.address;
      this.transaction.recipient = this.transaction.address;
    } else if (this.transaction.type === 'receive') {
      this.transaction.sender = this.transaction.address;
      this.transaction.recipient = this.account.address;
    }
    this.transaction.total = this.transaction.amount + this.transaction.fee;
    console.log('----- Transacdtion total: ', this.transaction.total);
  }

  async copyAddress(address: string) {

    console.log('Copy address: ', address);
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = address;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    const toast = await this.toastController.create({
      message: 'Copied to clipboard.',
      duration: 2000
    });

    toast.present();
  }

  async close() {
    await this.modalCtrl.dismiss();
  }

}
