import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Account } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
import zoobc, { EscrowListParams } from 'zoobc';
import { GetEscrowTransactionsResponse } from 'zoobc/grpc/model/escrow_pb';
import { OrderBy } from 'zoobc/grpc/model/pagination_pb';
import { makeShortAddress } from 'src/Helpers/converters';
import { Router, NavigationExtras } from '@angular/router';
import { AddressBookService } from 'src/app/Services/address-book.service';

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
  isLoadingBlockHeight: boolean;
  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private accountService: AccountService,
    private addresBookSrv: AddressBookService) { }

  ngOnInit() {
    this.loadAccount();

  }
  async loadAccount() {
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
      pagination: {
        page: this.page,
        limit: 100,
        orderBy: OrderBy.DESC,
        orderField: 'timeout',
      },
    };
    zoobc.Escrows.getList(params)
      .then((res: GetEscrowTransactionsResponse.AsObject) => {
        this.total = Number(res.total);

        const trxs = res.escrowsList.filter(tx => {
          if (tx.latest === true) { return tx; }
        });

        console.log('==== all task: ', trxs);
        const txMap = trxs.map(tx => {
          const alias = this.addresBookSrv.getNameByAddress(tx.recipientaddress) || '';
          return {
            id: tx.id,
            alias,
            senderaddress: makeShortAddress(tx.senderaddress),
            recipientaddress: makeShortAddress(tx.recipientaddress),
            approveraddress: makeShortAddress(tx.approveraddress),
            amount: tx.amount,
            commission: tx.commission,
            timeout: Number(tx.timeout),
            status: this.getStatusName(tx.status),
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

  getStatusName(status: number): any {
    switch (status) {

      case 0:
        return 'Pending';

      case 1:
        return 'Approved';

      case 2:
        return 'Rejected';

      case 3:
        return 'Expired';

      default:
        return 'Unknown';
    }
  }



  getBlockHeight() {
    this.isLoadingBlockHeight = true;
    zoobc.Host.getInfo()
      .then(res => {
        this.blockHeight = res.chainstatusesList[1].height;
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => (this.isLoadingBlockHeight = false));
  }

  openDetail(escrowId: string) {
    console.log('=== escrow Id: ', escrowId);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        escrowId
      }
    };
    this.router.navigate(['/task-detail'], navigationExtras);
    // TODO show detail page;
  }

}
