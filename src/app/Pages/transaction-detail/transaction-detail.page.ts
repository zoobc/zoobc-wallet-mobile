import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/Interfaces/transaction';
import { NavParams, ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/Services/util.service';

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
    private utilService: UtilService,
    private navParams: NavParams,
    public modalCtrl: ModalController,
  ) {

  }

  ngOnInit() {

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
  }

  async copyAddress(address: string) {
    this.utilService.copyToClipboard(address);
  }

  async close() {
    await this.modalCtrl.dismiss();
  }

}
