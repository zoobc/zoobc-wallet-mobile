import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/Interfaces/transaction';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
import { ActiveAccountService } from 'src/app/services/active-account.service';
import { AccountService } from 'src/app/services/account.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.page.html',
  styleUrls: ['./transaction-detail.page.scss']
})
export class TransactionDetailPage implements OnInit {
  transaction: Transaction = {
    id: null,
    type: null,
    sender: '',
    recipient: '',
    amount: 0,
    fee: 0,
    total: 0,
    transactionDate: null
  };

  accountAddress: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private transactionSrv: TransactionService,
    private activeAccountSrv: ActiveAccountService,
    private toastController: ToastController,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.activeAccountSrv.accountSubject.subscribe({
      next: v => {
        this.accountAddress = this.accountService.getAccountAddress(v);
      }
    });

    this.activatedRoute.params.subscribe(params => {
      if (params.transId) {
        this.transactionDetail(params.transId);
      }
    });
  }

  async transactionDetail(transId) {
    const transactionObj = await ((
      this.transactionSrv.getTransaction(transId)
    ) as any);

    this.transaction = {
      id: transactionObj.id,
      type: transactionObj.type,
      sender: transactionObj.sender,
      recipient: transactionObj.recipient,
      amount: transactionObj.amount,
      fee: transactionObj.fee,
      total: (transactionObj.amount + transactionObj.fee),
      transactionDate: new Date()
    };

    // For testing copy address
    // this.transaction = {
    //   id: 'transactionObj.id',
    //   type: 'transactionObj.type',
    //   sender: 'transactionObj.sender',
    //   recipient: 'transactionObj.recipient',
    //   amount: 10,
    //   fee: 3,
    //   total: 13,
    //   transactionDate: new Date()
    // };
    // console.log('====== TRansaction:', this.transaction);

  }

  async copyAddress(address:string) {

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


}
