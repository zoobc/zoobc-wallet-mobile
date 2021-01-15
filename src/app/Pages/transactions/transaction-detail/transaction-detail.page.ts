// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//             contact us at roberto.capodieci[at]blockchainzoo.com
//             and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
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

  senderRecipentAlias = '';
  senderRecipentOptions = [
    { key: 'copy', label: 'copy' },
    { key: 'share', label: 'share' }
  ];

  transHashOptions = [
    { key: 'copy', label: 'copy' },
    { key: 'share', label: 'share' }
  ];
  currAccount: Account;

  constructor(
    private translateSrv: TranslateService,
    private network: Network,
    private alertCtrl: AlertController,
    private accountService: AccountService,
    private utilService: UtilService,
    private transactionSrv: TransactionService,
    private socialSharing: SocialSharing,
    private navCtrl: NavController,
    public platform: Platform,
  ) {

  }

  async ngOnInit() {
    this.loading = true;

    this.currAccount = await this.accountService.getCurrAccount();
    // console.log('==== currAccount: ', this.currAccount);

    this.trx = this.transactionSrv.tempTrx;
    // console.log('==== transaction: ', this.trx);


    // this.senderRecipentOptions = [
    //   { key: 'copy', label: this.textCopyAddress },
    //   { key: 'share', label: this.textShareAddress }
    // ];

    // this.transHashOptions = [
    //   { key: 'copy', label: this.textCopyAddress },
    //   { key: 'share', label: this.textShareAddress }
    // ];

    // if (!this.senderRecipentAlias) {
    //   this.senderRecipentOptions.push({ key: 'addToContact', label: this.textAddToContact });
    // }

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
      this.textCopyAddress = res['copy address'] || 'copy address';
      this.textShareAddress = res['share address'] || 'share address';
      this.textAddToContact = res['add to contact'] || 'add to contact';
    });
  }

  close(){
    this.navCtrl.pop();
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
