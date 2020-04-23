import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Account } from 'src/app/Interfaces/Account';
import { AccountService } from 'src/app/Services/account.service';
import zoobc, { EscrowListParams } from 'zoobc';
import { GetEscrowTransactionsResponse } from 'zoobc/grpc/model/escrow_pb';
import { OrderBy } from 'zoobc/grpc/model/pagination_pb';
import { makeShortAddress } from 'src/Helpers/converters';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.page.html',
  styleUrls: ['./my-tasks.page.scss'],
})
export class MyTasksPage implements OnInit {

  account: Account;
  escrowTransactions: any;
  page = 1;
  total = 0;
  blockHeight = 0;
  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private accountService: AccountService) {}

  ngOnInit() {
    this.loadAccount();

  }
  async loadAccount(){
    this.account = await this.accountService.getCurrAccount();
    console.log('=== Account: ', this.account);
    this.getEscrowTransaction();
    this.getBlockHeight();
  }
  async showTaskDetail() {
    const alert = await this.alertCtrl.create({
      header: 'Coming Soon!',
      message: 'Feature will available soon',
      buttons: ['Close']
    });
    await alert.present();
  }

  getEscrowTransaction() {

      console.log('==== getEscrowTransaction, ender');

      const params: EscrowListParams = {
        approverAddress: this.account.address,
        statusList: [0],
        pagination: {
          page: this.page,
          limit: 1000,
          orderBy: OrderBy.DESC,
          orderField: 'timeout',
        },
      };
      zoobc.Escrows.getList(params)
        .then((res: GetEscrowTransactionsResponse.AsObject) => {
          this.total = Number(res.total);
          const trxs = res.escrowsList;
          console.log('==== all task: ', trxs);
          const txMap = trxs.map(tx => {
            const alias = '-'; // get from addressbook by tx.recipientaddress;
            return {
              id: tx.id,
              alias,
              senderaddress: makeShortAddress(tx.senderaddress),
              recipientaddress: makeShortAddress(tx.recipientaddress),
              approveraddress: makeShortAddress(tx.approveraddress),
              amount: tx.amount,
              commission: tx.commission,
              timeout: Number(tx.timeout),
              status: tx.status,
              blockheight: tx.blockheight,
              latest: tx.latest,
              instruction: tx.instruction,
            };
          });
          this.escrowTransactions = txMap;
          console.log('==== getEscrowTransaction, escrowTransactions: ', this.escrowTransactions);
        })
        .catch(err => {
          console.log('==== getEscrowTransaction, error: ', err);
        });
  }

  getBlockHeight() {
    zoobc.Host.getBlock()
      .then(res => {
        this.blockHeight = res.chainstatusesList[1].height;
      })
      .catch(err => {
        console.log('=== getBlockHeight, error: ', err);
      });
  }

  openDetail(idx) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        escrowId: idx
      }
    };
    this.router.navigate(['/task-detail'], navigationExtras);
    // TODO show detail page;
  }

}
