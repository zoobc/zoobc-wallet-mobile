import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/Interfaces/transaction';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { UtilService } from 'src/app/Services/util.service';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.page.html',
  styleUrls: ['./transaction-detail.page.scss']
})
export class TransactionDetailPage implements OnInit {
  transaction: Transaction;
  account: any;
  status: string;

  constructor(
    private utilService: UtilService,
    private navParams: NavParams,
    public modalCtrl: ModalController,
    private translateSrv: TranslateService,
    private network: Network,
    private alertCtrl: AlertController
  ) {}

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
