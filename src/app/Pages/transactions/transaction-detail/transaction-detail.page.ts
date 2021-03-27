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
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Interfaces/account';
import { UtilService } from 'src/app/Services/util.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import zoobc, { ZBCTransaction } from 'zbc-sdk';
import { TransactionService } from 'src/app/Services/transaction.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getTranslation } from 'src/Helpers/utils';
import { AuthService } from 'src/app/Services/auth-service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router } from '@angular/router';
import { LiquidStopTransactionInterface } from 'zbc-sdk/types/helper/transaction-builder/liquid-transaction';
import { ZOOBC_EXPL0RER_URL } from 'src/environments/variable.const';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.page.html',
  styleUrls: ['./transaction-detail.page.scss']
})
export class TransactionDetailPage implements OnInit {
  status: string;
  trx: ZBCTransaction;
  isLoading: boolean;

  liquidForm: FormGroup;

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
  doneOn: number;
  allowStop = false;

  public errorMessages = {
    fFee: [
      { type: 'required', message: 'Fee is required' },
      { type: 'min', message: 'Minimum 0.01 ZBC' }
    ]
  };
  txId: any;
  savedIds: any;

  constructor(
    private translateSrv: TranslateService,
    private network: Network,
    private alertCtrl: AlertController,
    private accountService: AccountService,
    private utilService: UtilService,
    private transactionSrv: TransactionService,
    private socialSharing: SocialSharing,
    private navCtrl: NavController,
    private authSrv: AuthService,
    private translate: TranslateService,
    private utilSrv: UtilService,
    private router: Router,
    public platform: Platform,
    private iab: InAppBrowser,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder
  ) {
    this.liquidForm = this.formBuilder.group({
      fTxId: ['', Validators.required],
      fSender: ['', Validators.required],
      fMessage: [''],
      fFee: [0.01, Validators.required]
    });
  }

  async submitForm() {
    if (this.liquidForm.dirty && this.liquidForm.valid) {

      // show loading bar
      const loading = await this.loadingController.create({
        message: 'Please wait, submiting!',
        duration: 100000
      });

      await loading.present();

      this.txId = this.liquidForm.value.fTxId;
      const data: LiquidStopTransactionInterface = {
        accountAddress: { value: this.liquidForm.value.fSender, type: 0 },
        transactionId: this.txId,
        fee: Number(this.liquidForm.value.fFee),
        message: this.liquidForm.value.fMessage
      };
      const childSeed = this.authSrv.keyring.calcDerivationPath(
        this.currAccount.path
      );
      zoobc.Liquid.stopLiquid(data, childSeed).then(
        async res => {
          console.log('msg: ', res);
          // save stopped liqud transaction
          this.transactionSrv.saveLiquidStoped(this.txId, this.doneOn);
          loading.dismiss();
          const message = getTranslation('your transaction is processing', this.translate);
          const subMessage = '';
          this.utilSrv.showConfirmation(message, subMessage, true);
          await this.transactionSrv.saveEscrowApprovedOrRejected(this.txId);
          this.transactionSrv.transferZooBcSubject.next(true);
          this.router.navigateByUrl('/tabs/home');
        },
        err => {
          console.log(err);
          const message = 'Opps...';
          loading.dismiss();
          const subMessage = getTranslation(err.message, this.translate);
          this.utilSrv.showConfirmation(message, subMessage, false);
        }
      ).finally(() => {
        loading.dismiss();
      });
    }

  }

  reload(event: any) {
    this.loadData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async ngOnInit() {
    // load from approved/rejected task
    this.savedIds = await this.transactionSrv.getEscrowApprovedOrRejected();

    this.loadData();
  }

  goToExplorer() {
    this.platform.ready().then(() => {
      const browser = this.iab.create(ZOOBC_EXPL0RER_URL + '/' + this.txId, '_system');
      browser.show();
    });
  }

  async loadData() {

    this.isLoading = true;
    await this.utilService.MergeAccountAndContact();

    this.currAccount = await this.accountService.getCurrAccount();
    this.trx = this.transactionSrv.tempTrx;
    this.txId = this.trx.id;
    console.log('== this.trx: ', this.trx);
    if (this.trx && this.trx.transactionTypeString && this.trx.transactionTypeString === 'liquid transaction') {
      this.liquidForm.get('fTxId').setValue(this.trx.id);
      if (this.currAccount) {
        this.liquidForm.get('fSender').setValue(this.currAccount.address.value);
      }

      this.liquidForm.get('fFee').setValue(0.01);
      this.doneOn = this.trx.timestamp + (this.trx.txBody.completeminutes * 60 * 1000);
      const ts = Math.round((new Date()).getTime());

      if (this.doneOn >= ts && this.trx.height) {
        this.allowStop = true;
      } else {
        this.allowStop = false;
      }
      console.log('saved cointain txId: ', this.savedIds.includes(this.txId));

      if (this.savedIds && this.savedIds.length > 0 && this.savedIds.includes(this.txId)) {
        this.allowStop = false;
      }
    }
    this.translateSrv.onLangChange.subscribe(() => {
      this.translateLang();
    });

    this.translateLang();
    this.isLoading = false;
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

  getName(address: string) {
    return this.accountService.getAlias(address);
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
    });
  }

  close() {
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
