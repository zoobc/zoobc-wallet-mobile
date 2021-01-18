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
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  MenuController,
  ToastController,
  LoadingController,
  ModalController,
  AlertController,
  PopoverController
} from '@ionic/angular';
import { Account } from 'src/app/Interfaces/account';
import { AuthService } from 'src/app/Services/auth-service';
import { Router, NavigationEnd } from '@angular/router';
import { TransactionDetailPage } from 'src/app/Pages/transactions/transaction-detail/transaction-detail.page';
import { CurrencyService } from 'src/app/Services/currency.service';
import { AccountService } from 'src/app/Services/account.service';
import {
  CONST_DEFAULT_RATE,
  DEFAULT_THEME
} from 'src/environments/variable.const';
import { ThemeService } from 'src/app/Services/theme.service';
import { Currency } from 'src/app/Interfaces/currency';
import { NetworkService } from 'src/app/Services/network.service';
import { makeShortAddress } from 'src/Helpers/converters';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';
import zoobc, {
  TransactionListParams,
  MempoolListParams,
  TransactionType,
  AccountBalance,
  EscrowListParams,
  OrderBy,
  getZBCAddress,
  ZBCTransaction
} from 'zbc-sdk';
import { PopoverAccountComponent } from 'src/app/Components/popover-account/popover-account.component';
import { PopoverBlockchainObjectOptionComponent } from './popover-blockchain-object-option/popover-blockchain-object-option.component';
import { TransactionService } from 'src/app/Services/transaction.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router,
    public modalCtrl: ModalController,
    private menuController: MenuController,
    public loadingController: LoadingController,
    private networkSrv: NetworkService,
    private currencySrv: CurrencyService,
    public toastController: ToastController,
    private themeSrv: ThemeService,
    private transactionSrv: TransactionService,
    private network: Network,
    private alertCtrl: AlertController,
    private translateSrv: TranslateService,
    private popoverCtrl: PopoverController
  ) {


    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        //
      }
    });


    // if account changed
    this.themeSrv.themeSubject.subscribe(() => {
      this.theme = this.themeSrv.theme;
    });


    // if network changed reload data
    this.networkSrv.changeNodeSubject.subscribe(() => {
      this.loadData();
    });

    // if currency changed
    this.currencySrv.currencySubject.subscribe((rate: Currency) => {
      this.currencyRate = rate;
    });

    this.accountService.restoreAccounts();

  }
  timeLeft = 12;
  interval: any;
  clickSub: any;
  public offset: number;
  startMatch = 0;
  accountBalance: AccountBalance;
  public isLoading = false;
  public currencyRate = CONST_DEFAULT_RATE;
  public priceInUSD: number;
  public isError = false;
  public navigationSubscription: any;
  txType: number = TransactionType.SENDMONEYTRANSACTION;
  account: Account;
  accounts: Account[];
  notifId = 1;
  theme = DEFAULT_THEME;
  lastTimeGetBalance: Date;

  alertConnectionTitle = '';
  alertConnectionMsg = '';
  networkSubscription = null;

  isLoadingRecentTx = false;
  recentTx: ZBCTransaction[];
  unconfirmTx: ZBCTransaction[];
  isErrorRecentTx = false;
  totalTx: number;
  lastRefresh: number;

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  shortAddress(address: string) {
    return makeShortAddress(address);
  }


  showAlert() {
    alert('Comng soon!');
  }


  async doRefresh(event: any) {
    // this.accountService.fetchAccountsBalance();
    await this.loadData();
    event.target.complete();
  }

  async ngOnInit() {
    await this.loadData();
    this.theme = this.themeSrv.theme;
    if (!this.theme || this.theme === undefined || this.theme === null) {
      this.theme = DEFAULT_THEME;
    }
    // this.startTimer();
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

  async loadData() {
    this.priceInUSD = this.currencySrv.getPriceInUSD();
    this.offset = 1;

    this.account = await this.accountService.getCurrAccount();
    this.currencyRate = this.currencySrv.getRate();

    this.getBalance();

  }



  /**
   * Get balance of current active address
   * @ param address
   */
  private async getBalance() {
    this.isLoading = true;
    this.isError = false;

    zoobc.Account.getBalance(this.account.address)
      .then((data: AccountBalance) => {
        this.accountBalance = data;
      })
      .catch(() => (this.isError = true))
      .finally(() => {
        this.isLoading = false;
        this.getTransactions();
      });
  }

  openMenu() {
    this.menuController.open('mainMenu');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  async switchAccount(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopoverAccountComponent,
      event: ev,
      cssClass: 'popover-account',
      translucent: true
    });

    popover.onWillDismiss().then(async ({ data }: { data: Account }) => {
      if (data) {
        this.account = data;
        this.accountService.switchAccount(data);
        this.getBalance();
      }
    });

    return popover.present();
  }

  openListAccount() {
    this.router.navigate(['list-account']);
  }

  openDetailUnconfirm(trx) {
    this.transactionSrv.tempTrx = trx;
    this.loadDetailTransaction(trx, 'pending');
  }

  openDetailTransction(trx) {
    this.loadDetailTransaction(trx, 'confirm');
  }

  goToAccount() {
    this.popoverCtrl.dismiss('');
    this.router.navigate(['/list-account']);
  }
  /**
   * Load detail transaction
   * @ param trx
   * @ param trxStatus
   */
  async loadDetailTransaction(trx: any, trxStatus: string) {
    const modal = await this.modalCtrl.create({
      component: TransactionDetailPage,
      cssClass: 'modal-zbc',
      componentProps: {
        transaction: trx,
        account: this.account,
        status: trxStatus
      }
    });
    await modal.present();
  }

  goToSend() {
    if (this.account.type && this.account.type === 'multisig') {
      this.goToMultisig();
    } else {
      // this.router.navigate(['/sendcoin']);
      this.router.navigate(['/transaction-form/send-money']);
    }
  }

  goToMultisig() {
    this.router.navigate(['/multisig']);
  }

  goToReceive() {
    this.router.navigate(['/receive']);
  }

  goToTransactions() {
    this.router.navigate(['/transactions']);
  }


  async showBlockchainObjectOption(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopoverBlockchainObjectOptionComponent,
      componentProps: {
        options: [
          {
            key: 'create',
            label: 'Create Blockchain Object'
          },
          {
            key: 'send',
            label: 'Send Blockchain Object'
          }
        ]
      },
      event: ev,
      translucent: true
    });

    popover.onWillDismiss().then(({ data }) => {
      switch (data) {
        case 'create':
          this.router.navigate(['/transaction-form/blockchain-object']);
          break;
        case 'send':
          this.router.navigate(['/transaction-form/blockchain-object/send']);
          break;
      }
    });

    return popover.present();
  }

  goToScan() {
    this.router.navigate(['/qr-scanner']);
  }

  goToTransactionDetail(trx) {
    this.transactionSrv.tempTrx = trx;
    this.router.navigate(['/transaction/0']);
  }

  groupEscrowList(escrowList: any[]) {
    const escrowCopy = escrowList.map(x => Object.assign({}, x));
    const escrowGroup = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < escrowCopy.length; i++) {
      const idx = escrowGroup.findIndex(eg => eg.id === escrowCopy[i].id);
      if (idx < 0) { escrowGroup.push(escrowCopy[i]); } else {
        if (escrowGroup[idx].blockheight > escrowCopy[i].blockheight) {
          escrowGroup[idx].blockheight = escrowCopy[i].blockheight;
        }
      }
    }
    escrowGroup.sort((a, b) => {
      return b.blockheight - a.blockheight;
    });
    return escrowGroup;
  }

  matchEscrowGroup(blockheight, escrowList: any[]) {
    let escrowObj: any;
    for (let i = this.startMatch; i < escrowList.length; i++) {
      if (escrowList[i].blockheight === blockheight) {
        escrowObj = Object.assign({}, escrowList[i]);
        this.startMatch = i;
      }
    }
    return escrowObj;
  }

  async getTransactions() {
    if (!this.isLoading) {
      this.recentTx = null;
      this.unconfirmTx = null;

      this.isLoading = true;
      this.isError = false;

      const params: TransactionListParams = {
        address: this.account.address,
        transactionType: this.txType,
        pagination: {
          page: 1,
          limit: 10,
        },
      };

      try {
        const trxList = await zoobc.Transactions.getList(params);

        let lastHeight = 0;
        let firstHeight = 0;
        if (trxList.total > 0) {
          lastHeight = trxList.transactions[0].height;
          firstHeight = trxList.transactions[trxList.transactions.length - 1].height;
        }

        const multisigTx = trxList.transactions.filter(trx => trx.multisig === true).map(trx => trx.id);

        const paramEscrow: EscrowListParams = {
          blockHeightStart: firstHeight,
          blockHeightEnd: lastHeight,
          recipient: this.account.address,
          statusList: [0, 1, 2, 3],
          latest: false,
          pagination: {
            orderBy: OrderBy.DESC,
            orderField: 'block_height',
          },
        };
        this.startMatch = 0;
        const escrowTx = await zoobc.Escrows.getList(paramEscrow);
        const escrowList = escrowTx.escrowList;
        const escrowGroup = this.groupEscrowList(escrowList);
        const tx = trxList.transactions;

        tx.map(recent => {
          const escStatus = this.matchEscrowGroup(recent.height, escrowGroup);
          recent.senderAlias = ''; // this.contactServ.get(recent.sender.value).name || '';
          recent.recipientAlias = ''; // this.contactServ.get(recent.recipient.value).name || '';
          if (this.txType === 2 || this.txType === 258 || this.txType === 514 || this.txType === 770) {
            if (recent.txBody.nodepublickey) {
              const buffer = Buffer.from(recent.txBody.nodepublickey.toString(), 'base64');
              const pubkey = getZBCAddress(buffer, 'ZNK');
              recent.txBody.nodepublickey = pubkey;
            }
          }
          if (escStatus) {
            recent.escrow = true;
            recent.txBody.approval = escStatus.status;
            recent.escrowStatus = escStatus.status;
          } else { recent.escrow = false; }
          recent.multisig = multisigTx.includes(recent.id);
          return recent;
        });
        this.recentTx = tx;
        console.log('== ntx: ', tx);
        this.totalTx = trxList.total;
        const paramPool: MempoolListParams = {
          address: this.account.address,
        };
        const unconfirmTx = await zoobc.Mempool.getList(paramPool);
        this.unconfirmTx = unconfirmTx.transactions.map(uc => {
          if (uc.escrow) { uc.txBody.approval = 0; }
          return uc;
        });
      } catch (error) {
        console.log(error);
        this.isError = true;
      } finally {
        this.isLoading = false;
        this.lastRefresh = Date.now();
      }
    }
  }
}
