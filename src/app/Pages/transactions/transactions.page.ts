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
import {
  ToastController,
  LoadingController,
  ModalController,
  AlertController
} from '@ionic/angular';
import { Account } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
import { TransactionService } from 'src/app/Services/transaction.service';
import { TransactionDetailPage } from 'src/app/Pages/transactions/transaction-detail/transaction-detail.page';
import { CurrencyService } from 'src/app/Services/currency.service';
import {
  NUMBER_OF_RECORD_IN_TRANSACTIONS,
  CONST_DEFAULT_RATE
} from 'src/environments/variable.const';
import zoobc, {
  TransactionListParams,
  MempoolListParams,
  EscrowListParams,
  TransactionType,
  Address,
  OrderBy,
  ZBCTransaction,
  getZBCAddress,
  parseAddress,
  ZBCTransactions,
} from 'zbc-sdk';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Transaction } from 'src/app/Interfaces/transaction';
import { Currency } from 'src/app/Interfaces/currency';
import { NetworkService } from 'src/app/Services/network.service';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss']
})
export class TransactionsPage implements OnInit {

  accountHistory: ZBCTransaction[];
  unconfirmTx: ZBCTransaction[];
  txType = -1;

  account: Account;
  page: number;

  currencyRate = CONST_DEFAULT_RATE;
  priceInUSD: number;
  totalTx: number;
  recentTxs = [];
  isError = false;
  navigationSubscription: any;
  isErrorRecentTx: boolean;
  addresses = [];
  alertConnectionTitle = '';
  alertConnectionMsg = '';
  networkSubscription = null;
  escrowTransactions: any;
  isLoading = false;
  total = 0;
  currentAddress: Address;
  lastRefresh: number;
  startMatch = 0;
  routerEvent: Subscription;

  constructor(
    private router: Router,
    public modalCtrl: ModalController,
    public loadingController: LoadingController,
    private accountService: AccountService,
    private transactionServ: TransactionService,
    private networkSrv: NetworkService,
    private currencyServ: CurrencyService,
    private addressBookSrv: AddressBookService,
    public toastController: ToastController,
    private translateSrv: TranslateService,
    private network: Network,
    private alertCtrl: AlertController,
    private activeRoute: ActivatedRoute
  ) {
    // if account changed
    this.accountService.accountSubject.subscribe(() => {
      this.loadData();
    });

    // if post send zoobc reload data
    this.transactionServ.sendMoneySubject.subscribe(() => {
      this.loadData();
    });

    // if network changed reload data
    this.networkSrv.changeNodeSubject.subscribe(() => {
      this.loadData();
    });

    // if currency changed
    this.currencyServ.currencySubject.subscribe((rate: Currency) => {
      this.currencyRate = rate;
    });

    this.routerEvent = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeRoute.queryParams.subscribe(res => {
          console.log('== res: ', res);
          this.txType = parseInt(res.val, 10) || -1;
        });
        this.getTransactions(true);
      }
    });
  }

  doRefresh(event: any) {
    this.showLoading();
    this.loadData();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  startTimer() {
    setInterval(async () => {
      this.getTransactions(true);
    }, 50000);
  }

  onFilter(val: any) {
    this.router.navigate(['/transactions'], { queryParams: { val } });
  }

  ngOnInit() {

    this.getAllAddress();
    this.loadData();
    this.getAllAccount();
    this.startTimer();

  }

  private async loadData() {
    this.page = 1;
    this.totalTx = 0;
    this.recentTxs = [];
    this.isError = false;

    this.priceInUSD = this.currencyServ.getPriceInUSD();
    this.account = await this.accountService.getCurrAccount();
    this.currencyRate = this.currencyServ.getRate();
    //  this.getUnconfirmTransactions(this.account.address.value);
    this.getTransactions(true);
    // this.getEscrowTransaction();
  }

  async getAllAddress() {
    const alladdress = await this.addressBookSrv.getAll();

    if (alladdress && alladdress.length > 0) {
      alladdress.forEach((obj: { name: any; address: string }) => {
        const app = {
          name: obj.name,
          address: obj.address
        };
        this.addresses.push(app);
      });
    }
  }

  async getAllAccount() {
    const accounts = await this.accountService.allAccount();
    if (accounts && accounts.length > 0) {
      accounts.forEach((obj) => {
        const app = {
          name: obj.name,
          address: obj.address.value
        };
        this.addresses.push(app);
      });
    }
  }

  /**
   * Get more transactions
   * @param event load event
   */
  async loadMoreData(event) {
    console.log('== this.recentTxs.length: ', this.recentTxs.length);
    console.log('-== this page: ', this.page);
    console.log('-== this totalTx: ', this.totalTx);
    if (this.recentTxs && this.recentTxs.length < this.totalTx) {
      this.page++;
      await this.getTransactions();
      event.target.complete();
    } else {
      setTimeout(async () => {
        if (this.recentTxs && this.recentTxs.length >= this.totalTx) {
          event.target.complete();
          event.target.disabled = true;
        }
      }, 500);
    }

    console.log('-== this page 2: ', this.page);


  }


  async getTransactions(reload: boolean = false) {
    if (!this.isLoading) {

      if (reload) {
        this.accountHistory = null;
        this.page = 1;
      }

      this.isLoading = true;
      this.isError = false;
      this.currentAddress = (await this.accountService.getCurrAccount()).address;

      console.log('===n this.txType:', this.txType);

      let txParam: TransactionListParams = {
        address: this.currentAddress,
        transactionType: this.txType,
        pagination: {
          page: this.page,
          limit: NUMBER_OF_RECORD_IN_TRANSACTIONS,
        },
      };

      if (this.txType === -1) {
        txParam = {
          address: this.currentAddress,
          pagination: {
            page: this.page,
            limit: NUMBER_OF_RECORD_IN_TRANSACTIONS,
          },
        };
      }
      try {
        const trxList = await zoobc.Transactions.getList(txParam);
        let lastHeight = 0;
        let firstHeight = 0;
        if (trxList.transactions.length > 0) {
          lastHeight = trxList.transactions[0].height;
          firstHeight = trxList.transactions[trxList.transactions.length - 1].height;
        }

        const multisigTx = trxList.transactions.filter(trx => trx.multisig === true).map(trx => trx.id);

        const paramEscrow: EscrowListParams = {
          blockHeightStart: firstHeight,
          blockHeightEnd: lastHeight,
          recipient: this.currentAddress,
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

        const txs = trxList.transactions;
        txs.map(recent => {
          const escStatus = this.matchEscrowGroup(recent.height, escrowGroup);
          recent.senderAlias = ''; // this.contactServ.get(recent.sender.value).name || '';
          recent.recipientAlias = ''; // this.contactServ.get(recent.recipient.value).name || '';
          const nodeManagementTxType =
            this.txType === 2 || this.txType === 258 || this.txType === 514 || this.txType === 770;
          if (nodeManagementTxType) {
            const hasNodePublicKey = recent.txBody.nodepublickey;
            const hasAccountAddress = recent.txBody.accountaddress;
            if (hasNodePublicKey) {
              const buffer = Buffer.from(recent.txBody.nodepublickey.toString(), 'base64');
              const pubkey = getZBCAddress(buffer, 'ZNK');
              recent.txBody.nodepublickey = pubkey;
            }
            if (hasAccountAddress) {
              const accountAddress = parseAddress(recent.txBody.accountaddress);
              recent.txBody.accountaddress = accountAddress.value;
            }
          }
          if (escStatus) {
            recent.escrow = true;
            recent.txBody.approval = escStatus.status;
          } else { recent.escrow = false; }
          recent.multisig = multisigTx.includes(recent.id);
          return recent;
        });
        this.total = trxList.total;
        this.accountHistory = reload ? txs : this.accountHistory.concat(txs);
        console.log('== accountHistory: ', this.accountHistory);
        if (reload) {
          const mempoolParams: MempoolListParams = { address: this.currentAddress };
          this.unconfirmTx = await zoobc.Mempool.getList(mempoolParams).then((res: ZBCTransactions) =>
            res.transactions.map(uc => {
              this.txType = uc.transactionType;
              return uc;
            })
          );

        }
      } catch {
        this.isError = true;
        this.unconfirmTx = null;
      } finally {
        this.isLoading = false;
        this.lastRefresh = Date.now();
      }
    }
  }


  checkIdOnEscrow(id: any, escrowArr: any[]) {
    const filter = escrowArr.filter(arr => arr.id === id);
    if (filter.length > 0) { return true; }
    return false;
  }

  getEscrowStatus(id: any, escrowArr: any[]) {
    const idx = escrowArr.findIndex(esc => esc.id === id);
    return escrowArr[idx].status;
  }


  getName(address: string) {
    let nama = '';
    if (this.addresses && this.addresses.length > 0) {
      this.addresses.forEach((obj: { name: any; address: string; }) => {
        if (address === obj.address) {
          nama = obj.name;
        }
      });
    }

    return nama;
  }

  /**
   * Open detail Unconfirm transactin
   * @param trx is unconfirm transaction object
   */
  public async openDetailUnconfirm(trx) {
    this.transactionServ.tempTrx = trx;
    this.router.navigate(['/transaction/0']);
  }

  private showLoading() {
    this.loadingController.create({
      message: 'Loading ...',
      duration: 500
    }).then((res) => {
      res.present();
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

  goToTransactionDetail(trx) {
    this.transactionServ.tempTrx = trx;
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

}
