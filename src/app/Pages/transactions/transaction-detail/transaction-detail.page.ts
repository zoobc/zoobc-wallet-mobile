import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/Interfaces/transaction';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
import { ActivatedRoute } from '@angular/router';
import zoobc, { getZBCAddress, toTransactionWallet, TransactionResponse } from 'zoobc-sdk';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Interfaces/account';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.page.html',
  styleUrls: ['./transaction-detail.page.scss']
})
export class TransactionDetailPage implements OnInit {
  status: string;
  transactionId: string;
  transaction: TransactionResponse = null;
  transactionWallet: any;
  loading: boolean;

  constructor(
    private translateSrv: TranslateService,
    private network: Network,
    private alertCtrl: AlertController,
    private activeRoute: ActivatedRoute,
    private accountService: AccountService
  ) {

  }

  ngOnInit() {
    this.loading = true;

    this.activeRoute.params.subscribe(async params => {

      const currAccount: Account = await this.accountService.getCurrAccount();

      const transactionId = params.transId;

      const transaction: TransactionResponse = await zoobc.Transactions.get(transactionId);

      this.transactionWallet = toTransactionWallet(transaction, currAccount.address);

      const pubkey = Buffer.from(this.transactionWallet.id.toString(), 'base64');
      this.transactionWallet.transactionhash = getZBCAddress(pubkey, 'ZTX');

      this.transaction = transaction;

      this.loading = false;

    });


    /*if (this.navParams && this.navParams.data) {
      this.transaction = this.navParams.data.transaction;
      this.account = this.navParams.data.account;
      this.status = this.navParams.data.status;
    }*/

    /*if (this.transaction.type === 'send') {
      this.transaction.sender = this.account.address;
      this.transaction.recipient = this.transaction.address;
    } else if (this.transaction.type === 'receive') {
      this.transaction.sender = this.transaction.address;
      this.transaction.recipient = this.account.address;
    }
    this.transaction.total = this.transaction.amount + this.transaction.fee;*/
  }

  alertConnectionTitle: string = '';
  alertConnectionMsg: string = '';
  networkSubscription = null;

  ionViewWillEnter() {
    this.networkSubscription = this.network
      .onDisconnect()
      .subscribe(async () => {
        const alert = await this.alertCtrl.create({
          header: this.alertConnectionTitle,
          message: this.alertConnectionMsg,
          buttons: [
            {
              text: 'OK'
            }
          ],
          backdropDismiss: false
        });

        alert.present();
      });

    this.translateSrv.get('No Internet Access').subscribe((res: string) => {
      this.alertConnectionTitle = res;
    });

    this.translateSrv
      .get(
        "Oops, it seems that you don't have internet connection. Please check your internet connection"
      )
      .subscribe((res: string) => {
        this.alertConnectionMsg = res;
      });
  }

  ionViewDidLeave() {
    if (this.networkSubscription) {
      this.networkSubscription.unsubscribe();
    }
  }
}
