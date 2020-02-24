import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/Interfaces/transaction';
import { ToastController, NavParams, ModalController } from '@ionic/angular';
import { AccountService } from 'src/app/Services/account.service';

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
    private accountService: AccountService,
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
    // console.log('----- Transacdtion total: ', this.transaction.total);
  }

  async copyAddress(address: string) {
    this.accountService.copyToClipboard(address);
  }

  async close() {
    await this.modalCtrl.dismiss();
  }

}
