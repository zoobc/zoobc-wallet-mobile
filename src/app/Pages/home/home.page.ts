// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General License for more details.

// You should have received a copy of the GNU General License
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
  PopoverController,
  Platform
} from '@ionic/angular';
import { Account } from 'src/app/Interfaces/account';
import { AuthService } from 'src/app/Services/auth-service';
import { Router, NavigationEnd, NavigationExtras } from '@angular/router';
import { TransactionDetailPage } from 'src/app/Pages/transactions/transaction-detail/transaction-detail.page';
import { CurrencyService } from 'src/app/Services/currency.service';
import { AccountService } from 'src/app/Services/account.service';
import {
  CONST_DEFAULT_RATE,
  DEFAULT_THEME,
  LOGIN_TYPE_ADDRESS,
  LOGIN_TYPE_PASSPHRASE} from 'src/environments/variable.const';
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
  ZBCTransaction,
  GroupData,
  Address,
  EscrowStatus,
  ZBCTransactions
} from 'zbc-sdk';
import { PopoverAccountComponent } from 'src/app/Components/popover-account/popover-account.component';
import { PopoverBlockchainObjectOptionComponent } from './popover-blockchain-object-option/popover-blockchain-object-option.component';
import { TransactionService } from 'src/app/Services/transaction.service';
import { UtilService } from 'src/app/Services/util.service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { getTranslation } from 'src/Helpers/utils';
import Swal from 'sweetalert2';
import { MultisigService } from 'src/app/Services/multisig.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  sBalances: string[];
  networkLabel = 'mainnet';
  isBalanceEqual: boolean;
  lockedBalance: number;
  timeLeft = 12;
  interval: any;
  clickSub: any;
  offset: number;
  startMatch = 0;
  accountBalance: AccountBalance;
  strBalance = '0.00';
  isLoading = false;
  currencyRate = CONST_DEFAULT_RATE;
  priceInUSD: number;
  isError = false;
  navigationSubscription: any;
  account: Account;
  currentAddress: Address;
  accounts: Account[];
  notifId = 1;
  theme = DEFAULT_THEME;
  lastTimeGetBalance: Date;
  page = 1;

  alertConnectionTitle = '';
  alertConnectionMsg = '';
  networkSubscription = null;

  isLoadingRecentTx = false;
  recentTx: ZBCTransaction[];
  unconfirmTx: ZBCTransaction[];
  isErrorRecentTx = false;
  // totalTx: number;
  total = 0;
  lastRefresh: number;
  isAccMultisig: boolean;
  fullBalance = false;
  accountHistory: ZBCTransaction[];
  isLoadingBalance: boolean;
  isErrorBalance: boolean;
  isIPhone = false;
  loginType: number;

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router,
    private utilSrv: UtilService,
    public modalCtrl: ModalController,
    private menuController: MenuController,
    public loadingController: LoadingController,
    private networkSrv: NetworkService,
    private currencySrv: CurrencyService,
    public toastController: ToastController,
    private transactionSrv: TransactionService,
    private multisigServ: MultisigService,
    private network: Network,
    private translate: TranslateService,
    private alertCtrl: AlertController,
    private translateSrv: TranslateService,
    private popoverCtrl: PopoverController,
    public platform: Platform
  ) {

    this.transactionSrv.transferZooBcSubject.subscribe(() => {
      this.loadData();
    });

    // if network changed reload data
    this.networkSrv.changeNodeSubject.subscribe(() => {
      this.loadData();
    });

    // if currency changed
    this.currencySrv.currencySubject.subscribe((rate: Currency) => {
      this.currencyRate = rate;
    });

    // if account switched
    this.accountService.accountSubject.subscribe(() => {
      this.loadData();
    });

  }



  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  shortAddress(address: string) {
    return makeShortAddress(address);
  }

  formatBalance(numDigit: number) {
    const blnc = (this.accountBalance.spendableBalance / 1e8).toString();
    let decSparator = '.';
    if (blnc.indexOf('.')) {
      decSparator = '.';
      this.sBalances = blnc.split('.');
    } else if (blnc.indexOf(',')) {
      decSparator = ',';
      this.sBalances = blnc.split(',');
    }
    const bln1 = this.sBalances[1] ? decSparator + this.sBalances[1].slice(0, numDigit) : '';
    this.sBalances[1] = bln1;

    this.lockedBalance = Number(this.accountBalance.balance) - Number(this.accountBalance.spendableBalance);
    this.isBalanceEqual = (Number(this.accountBalance.balance) > Number(this.accountBalance.spendableBalance));
  }


  async doRefresh(event: any) {
    // this.accountService.fetchAccountsBalance();
    this.loadData();
    event.target.complete();
  }

  ngOnInit() {
    this.loginType = this.authService.loginType;
    // console.log('=== this.loginType:', this.loginType);
    const currentPlatform = this.platform.platforms();
    if (currentPlatform.includes('iphone')) {
        this.isIPhone = true;
    } else {
        this.isIPhone = false;
    }
    this.fullBalance = false;
    this.startTimer();
  }


  startTimer() {
    setInterval(async () => {
      this.getBalance();
    }, 60000);
  }

  ionViewWillEnter() {
    this.loginType = this.authService.loginType;
    console.log('=== this.loginType:', this.loginType);
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
    this.loadData();
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

    // console.log('List group: ', this.networks);
    const activeNetwork: GroupData = await this.networkSrv.getActiveGroup();
    if (activeNetwork) {
      this.networkLabel = (activeNetwork.label).toLowerCase();
      // console.log('activeNetwork group: ', this.networkLabel);
    }

    this.priceInUSD = this.currencySrv.getPriceInUSD();
    this.offset = 1;
    this.account = await this.accountService.getCurrAccount();

    // console.log('== this.account: ', this.account);

    this.isAccMultisig = this.account.type === 'multisig' ? true : false;
    await this.getBalance();
    await this.getTransactions();
  }



  /**
   * Get balance of current active address
   * @ param address
   */
  private async getBalance() {
    this.isLoadingBalance = true;
    this.isErrorBalance = false;

    zoobc.Account.getBalance(this.account.address)
      .then((data: AccountBalance) => {
        this.accountBalance = data;
        this.formatBalance(4);
      })
      .catch(() => (this.isErrorBalance = true))
      .finally(() => {
        this.isLoadingBalance = false;
      });
  }

  async showBalanceFull() {
    if (this.fullBalance === true) {
      this.fullBalance = false;
      this.formatBalance(8);
    } else {
      this.fullBalance = true;
      this.formatBalance(4);
    }
    // if (!accountBalance) {
    //   return;
    // }
    // const strBalance = 'Balance: ' + (this.accountBalance.balance / 1e8).toFixed(8)
    //   + '\n Spendable: ' + (this.accountBalance.spendableBalance / 1e8).toFixed(8);
    // const alert = await this.alertCtrl.create({
    //   message: strBalance,
    //   buttons: ['OK']
    // });

    // await alert.present();

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
        // this.account = data;
        await this.accountService.switchAccount(data);
        // this.getBalance();
        // this.loadData();
      }
    });

    return popover.present();
  }

  openListAccount() {
    this.router.navigate(['list-account']);
  }

  copyToClipboard() {
    this.utilSrv.copyToClipboard(this.account.address.value);
  }

  goToAccount() {
    if (this.loginType !== LOGIN_TYPE_PASSPHRASE) {
      this.utilSrv.showAlert('Error', 'Manage account denied!', 'Manage account is not Allowed if login with Address or private key!');
      return;
    }
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


  async createMsigTransaction() {
    const txType = TransactionType.SENDZBCTRANSACTION;
    const multisig: MultiSigDraft = {
      accountAddress: null,
      fee: 0,
      id: 0,
      multisigInfo: null,
      unisgnedTransactions: null,
      signaturesInfo: null,
      txType,
      txBody: {},
    };


    const accounts = (await this.accountService
      .allAccount())
      .filter((acc: any) => this.account.participants.some(address => address.value === acc.address.value));

    // if no address on the participants
    if (accounts.length < 1) {
      const message = getTranslation('you dont have any account that in participant list', this.translate);
      Swal.fire({ type: 'error', title: 'Oops...', text: message });
      return false;
    }

    multisig.multisigInfo = {
      minSigs: this.account.minSig,
      nonce: this.account.nonce,
      participants: this.account.participants,
    };

    multisig.txBody.sender = this.account.address;
    this.multisigServ.update(multisig);
    this.router.navigate(['/msig-create-transaction']);

  }

  goToSend() {

    if (this.loginType === LOGIN_TYPE_ADDRESS) {
      this.utilSrv.showAlert('Error', 'Transfer ZBC denied!', 'Transfer ZBC is not Allowed if login with Address!');
      return;
    }

    if (this.account.type && this.account.type === 'multisig') {
      this.createMsigTransaction();
    } else {
      this.router.navigate(['/transaction-form/send-zoobc']);
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
    this.router.navigateByUrl('/qr-scanner');
    const navigationExtras: NavigationExtras = {
      queryParams: {
        from: 'dashboard'
      }
    };
    this.router.navigate(['/qr-scanner'], navigationExtras);
  }

  goToTransactionDetail(trx: any) {
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

      this.unconfirmTx = [];
      this.accountHistory = [];
      this.isLoading = true;
      this.isError = false;
      this.currentAddress = (await this.accountService.getCurrAccount()).address;

      try {

        // get transfer zoobc transaction list
        const txParam: TransactionListParams = {
          address: this.currentAddress,
          pagination: {
            page: this.page,
            limit: 10,
          },
        };

        const trxList = await zoobc.Transactions.getList(txParam);
        let lastHeight = 0;
        let firstHeight = 0;
        if (trxList.transactions.length > 0) {
          lastHeight = trxList.transactions[0].height;
          firstHeight = trxList.transactions[trxList.transactions.length - 1].height;
        }
        // end of transfer zoobc

        // get multisig by filtering transfer zoobc list where multisig = true
        const multisigTx = trxList.transactions.filter(trx => trx.multisig === true).map(trx => trx.id);
        // end of multisig

        // Get escrow transaction
        const paramEscrow: EscrowListParams = {
          blockHeightStart: firstHeight,
          blockHeightEnd: lastHeight,
          recipient: this.currentAddress,
          statusList: [EscrowStatus.PENDING, EscrowStatus.REJECTED, EscrowStatus.APPROVED, EscrowStatus.EXPIRED],
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
        // end of escrow transaction

        const txs = trxList.transactions;
        txs.map(recent => {
          const escStatus = this.matchEscrowGroup(recent.height, escrowGroup);
          recent.senderAlias = this.accountService.getAlias(recent.sender.value) || '';
          recent.recipientAlias = this.accountService.getAlias(recent.recipient.value) || '';

          if (escStatus) {
            recent.escrow = true;
            recent.txBody.approval = escStatus.status;
          } else { recent.escrow = false; }
          recent.multisig = multisigTx.includes(recent.id);
          return recent;
        });

        this.total = trxList.total;
        this.accountHistory = txs;
        this.getUnconfirmTransaction();

      } catch {
        this.isError = true;
        this.unconfirmTx = null;
      } finally {
        this.isLoading = false;
        this.lastRefresh = Date.now();
      }
    }
  }

  /**
   * get Unconfirm Transaction
   */
  async getUnconfirmTransaction() {
    const mempoolParams: MempoolListParams = { address: this.currentAddress };
    this.unconfirmTx = await zoobc.Mempool.getList(mempoolParams).then((res: ZBCTransactions) =>
        res.transactions.map(uc => {
          return uc;
        })
      );
  }

}
