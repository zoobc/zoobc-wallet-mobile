import { Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
import { ActivatedRoute } from '@angular/router';
// import zoobc, { getZBCAddress, toTransactionWallet, TransactionResponse } from 'zbc-sdk';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Interfaces/account';
import { UtilService } from 'src/app/Services/util.service';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import zoobc, { getZBCAddress } from 'zbc-sdk';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.page.html',
  styleUrls: ['./transaction-detail.page.scss']
})
export class TransactionDetailPage implements OnInit {
  status: string;
  transactionId: string;
  // transaction: TransactionResponse = null;
  transactionWallet: any;
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

  constructor(
    private translateSrv: TranslateService,
    private network: Network,
    private alertCtrl: AlertController,
    private activeRoute: ActivatedRoute,
    private accountService: AccountService,
    private utilService: UtilService,
    private addressBookSrv: AddressBookService,
    private socialSharing: SocialSharing,
    public platform: Platform,
  ) {

  }

  async ngOnInit() {
    this.loading = true;

    this.activeRoute.params.subscribe(async params => {

      const currAccount: Account = await this.accountService.getCurrAccount();

      const transactionId = params.transId;

      // const transaction: TransactionResponse = await zoobc.Transactions.get(transactionId);

      // this.transactionWallet = toTransactionWallet(transaction, currAccount.address);

      this.senderRecipentAlias = await this.addressBookSrv.getNameByAddress(
        this.transactionWallet.address
      );

      this.senderRecipentOptions = [
        {key: 'copy', label: this.textCopyAddress},
        {key: 'share', label: this.textShareAddress}
      ];

      this.transHashOptions = [
        {key: 'copy', label: this.textCopyAddress},
        {key: 'share', label: this.textShareAddress}
      ];

      if (!this.senderRecipentAlias) {
        this.senderRecipentOptions.push({key: 'addToContact', label: this.textAddToContact});
      }

      // const pubkey = Buffer.from(transaction.transactionhash.toString(), 'base64');
      // this.transactionWallet.transactionhash = getZBCAddress(pubkey, 'ZTX');

      // this.transaction = transaction;

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

    this.translateSrv.onLangChange.subscribe((event: LangChangeEvent) => {
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
