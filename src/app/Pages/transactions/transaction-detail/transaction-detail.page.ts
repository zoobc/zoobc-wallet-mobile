import { Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Interfaces/account';
import { UtilService } from 'src/app/Services/util.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ZBCTransaction } from 'zbc-sdk';
import { TransactionService } from 'src/app/Services/transaction.service';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.page.html',
  styleUrls: ['./transaction-detail.page.scss']
})
export class TransactionDetailPage implements OnInit {
  status: string;
  transactionId: string;
  trx: ZBCTransaction;
  loading: boolean;

  private textCopyAddress: string;
  private textAddToContact: string;
  private textShareAddress: string;

  alertConnectionTitle = '';
  alertConnectionMsg = '';
  networkSubscription = null;

  senderRecipentOptions = [];
  senderRecipentAlias = '';

  transHashOptions = [];
  currAccount: Account;

  constructor(
    private translateSrv: TranslateService,
    private network: Network,
    private alertCtrl: AlertController,
    private accountService: AccountService,
    private utilService: UtilService,
    private transactionSrv: TransactionService,
    private socialSharing: SocialSharing,
    public platform: Platform,
  ) {

  }

  async ngOnInit() {
    this.loading = true;

    this.currAccount = await this.accountService.getCurrAccount();
    console.log('==== currAccount: ', this.currAccount);

    this.trx = this.transactionSrv.tempTrx;
    console.log('==== transaction: ', this.trx);


    this.senderRecipentOptions = [
      { key: 'copy', label: this.textCopyAddress },
      { key: 'share', label: this.textShareAddress }
    ];

    this.transHashOptions = [
      { key: 'copy', label: this.textCopyAddress },
      { key: 'share', label: this.textShareAddress }
    ];

    if (!this.senderRecipentAlias) {
      this.senderRecipentOptions.push({ key: 'addToContact', label: this.textAddToContact });
    }

    this.loading = false;

    this.translateSrv.onLangChange.subscribe(() => {
      this.translateLang();
    });

    this.translateLang();
  }

  onTransHashOptionsClose(event, address) {
    switch (event) {
      case 'copy':
        this.utilService.copyToClipboard(address);
        break;
      case 'share':
        this.platform.ready().then(async () => {
          await this.socialSharing.share(address).then(() => {
          }).catch((err) => {
            console.log(err);
          });
        });
        break;
    }
  }

  onSenderRecipentOptionsClose(event, address) {
    switch (event) {
      case 'copy':
        this.utilService.copyToClipboard(address);
        break;
      case 'share':
        this.platform.ready().then(async () => {
          await this.socialSharing.share(address).then(() => {
          }).catch((err) => {
            console.log(err);
          });
        });
        break;
    }
  }

  translateLang() {
    this.translateSrv.get([
      'copy address',
      'share address',
      'add to contact',
    ]).subscribe((res: any) => {
      this.textCopyAddress = res['copy address'];
      this.textShareAddress = res['share address'];
      this.textAddToContact = res['add to contact'];
    });
  }



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
        'Oops, it seems that you don\'t have internet connection. Please check your internet connection'
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
