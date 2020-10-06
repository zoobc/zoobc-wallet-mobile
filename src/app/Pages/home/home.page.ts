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
import { Router, NavigationExtras, NavigationEnd } from '@angular/router';
import { TransactionService } from 'src/app/Services/transaction.service';
import { TransactionDetailPage } from 'src/app/Pages/transactions/transaction-detail/transaction-detail.page';
import { CurrencyService } from 'src/app/Services/currency.service';
import { AccountService } from 'src/app/Services/account.service';
import {
  BLOCKCHAIN_BLOG_URL,
  CONST_DEFAULT_RATE,
  NETWORK_LIST,
  DEFAULT_THEME
} from 'src/environments/variable.const';
import { FcmService } from 'src/app/Services/fcm.service';
import { ThemeService } from 'src/app/Services/theme.service';
import { FcmIdentity } from 'src/app/Interfaces/fcm-identity';
import { ChatService } from 'src/app/Services/chat.service';
import { Currency } from 'src/app/Interfaces/currency';
import { DecimalPipe } from '@angular/common';
import { NetworkService } from 'src/app/Services/network.service';
import { dateAgo } from 'src/Helpers/utils';
import { makeShortAddress } from 'src/Helpers/converters';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';
import zoobc, {
  TransactionListParams,
  toTransactionListWallet,
  getZBCAddress,
  MempoolListParams,
  toUnconfirmedSendMoneyWallet,
  AccountBalanceResponse,
  TransactionsResponse,
  TransactionType
} from 'zoobc-sdk';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { PopoverAccountComponent } from 'src/app/Shared/component/popover-account/popover-account.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  timeLeft = 12;
  interval: any;

  identity: FcmIdentity;
  clickSub: any;
  public offset: number;

  public accountBalance: any;
  public isLoadingBalance: boolean;
  public currencyRate = CONST_DEFAULT_RATE;
  public priceInUSD: number;
  public isError = false;
  public navigationSubscription: any;

  account: Account;
  accounts: Account[];
  notifId = 1;
  theme = DEFAULT_THEME;
  lastTimeGetBalance: Date;
  lastBalanceUpdated = 'Just now';

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
    private fcmService: FcmService,
    private themeSrv: ThemeService,
    private chatService: ChatService,
    private alertController: AlertController,
    private decimalPipe: DecimalPipe,
    private network: Network,
    private alertCtrl: AlertController,
    private translateSrv: TranslateService,
    private addressBookSrv: AddressBookService,
    private popoverCtrl: PopoverController
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.loadData();
      }
    });

    // // if account changed
    // this.accountService.accountSubject.subscribe(() => {
    //   this.loadData();
    // });

    // if account changed
    this.themeSrv.themeSubject.subscribe(() => {
      this.theme = this.themeSrv.theme;
    });

    // // if post send money reload data
    // this.transactionSrv.sendMoneySubject.subscribe(() => {
    //   this.loadData();
    // }
    // );

    // if network changed reload data
    this.networkSrv.changeNodeSubject.subscribe(() => {
      this.loadData();
    });

    // if currency changed
    this.currencySrv.currencySubject.subscribe((rate: Currency) => {
      this.currencyRate = rate;
    });

    this.accountService.restoreAccounts();
    this.subscribeAllAccount();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  shortAddress(address: string) {
    return makeShortAddress(address);
  }

  async showBalanceDetail() {
    const alert = await this.alertController.create({
      header: 'Account:',
      subHeader: this.account.address,
      message:
        'Balance: <br/>' +
        this.decimalPipe.transform(this.accountBalance.balance / 1e8) +
        ' ZBC <br/>' +
        '<br/>' +
        'Spendable Balance: <br/>' +
        this.decimalPipe.transform(this.accountBalance.spendablebalance / 1e8) +
        ' ZBC  <br/>',
      buttons: ['OK']
    });

    await alert.present();
  }

  async subscribeAllAccount() {
    const allAcc = await this.accountService.allAccount();
    const addresses = allAcc.map(acc => acc.address);
    this.chatService.subscribeNotif(addresses);
  }

  async doRefresh(event: any) {
    await this.loadData()
    event.target.complete();
  }

  async ngOnInit() {
    await this.loadData();
    this.theme = this.themeSrv.theme;
    if (!this.theme || this.theme === undefined || this.theme === null) {
      this.theme = DEFAULT_THEME;
    }
    this.startTimer();

    this.getTransactions();
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

  async loadData() {
    this.priceInUSD = this.currencySrv.getPriceInUSD();
    this.accountBalance = {
      accountaddress: '',
      blockheight: 0,
      spendablebalance: 0,
      balance: 0,
      poprevenue: '',
      latest: false
    };

    this.offset = 1;
    this.accountBalance = 0;
    this.isLoadingBalance = true;
    this.isError = false;

    this.account = await this.accountService.getCurrAccount();
    this.currencyRate = this.currencySrv.getRate();

    this.getBalanceByAddress(this.account.address);
    await this.fcmService.getToken(this.account);
    this.identity = this.fcmService.identity;
    this.subscribeAllAccount();
    this.getTransactions();
  }

  /**
   * Get balance of current active address
   * @ param address
   */
  private async getBalanceByAddress(address: string) {
    this.isError = false;
    this.isLoadingBalance = true;

    await zoobc.Account.getBalance(address)
      .then(data => {
        this.accountBalance = data.accountbalance;
        this.lastTimeGetBalance = new Date();
      })
      .catch(error => {
        console.error(error);
        this.accountBalance = {
          accountaddress: '',
          blockheight: 0,
          spendablebalance: 0,
          balance: 0,
          poprevenue: '',
          latest: false
        };
        this.isError = true;
        console.log(
          'dashboard balance',
          'An error occurred while processing your request'
        );
      })
      .finally(() => {
        this.isLoadingBalance = false;
      });
  }

  startTimer() {
    setInterval(() => {
      this.lastBalanceUpdated = dateAgo(this.lastTimeGetBalance);
    }, 5000);
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
        this.accountService.setActiveAccount(data);
        this.getBalanceByAddress(data.address);
        this.getTransactions();
      }
    });

    return popover.present();
  }

  openListAccount() {
    this.router.navigate(['list-account']);
  }

  openDetailUnconfirm(trx) {
    this.loadDetailTransaction(trx, 'pending');
  }

  openDetailTransction(trx) {
    this.loadDetailTransaction(trx, 'confirm');
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
      this.router.navigate(['/multisig']);
    } else {
      //this.router.navigate(['/sendcoin']);
      this.router.navigate(['/transaction-form/send-money']);
    }
  }

  goToReceive() {
    this.router.navigate(['/receive']);
  }

  goToTransactions() {
    this.router.navigate(['/transactions']);
  }

  goToScan() {
    this.router.navigate(['/qr-scanner']);
  }

  goToTransactionDetail(transactionId) {
    this.router.navigate(['/transaction/' + transactionId]);
  }

  isLoadingRecentTx: boolean = false;
  recentTx: any;
  unconfirmTx: any;
  isErrorRecentTx: boolean = false;
  totalTx: number;
  lastRefresh: number;

  getTransactions() {
    if (!this.isLoadingRecentTx) {
      this.recentTx = null;
      this.unconfirmTx = null;

      this.isLoadingRecentTx = true;
      this.isErrorRecentTx = false;

      const params: TransactionListParams = {
        address: this.account.address,
        transactionType: TransactionType.SENDMONEYTRANSACTION,
        pagination: {
          page: 1,
          limit: 5
        }
      };

      zoobc.Transactions.getList(params)
        .then((res: TransactionsResponse) => {
          const tx = toTransactionListWallet(res, this.account.address);
          this.recentTx = tx.transactions;
          this.recentTx.map(async recent => {
            recent['alias'] = await this.addressBookSrv.getNameByAddress(
              recent.address
            );
          });
          this.totalTx = tx.total;

          const params: MempoolListParams = {
            address: this.account.address
          };

          return zoobc.Mempool.getList(params);
        })
        .then(
          unconfirmTx =>
            (this.unconfirmTx = toUnconfirmedSendMoneyWallet(
              unconfirmTx,
              this.account.address
            ))
        )
        .catch(e => {
          this.isErrorRecentTx = true;
        })
        .finally(
          () => (
            (this.isLoadingRecentTx = false), (this.lastRefresh = Date.now())
          )
        );
    }
  }
}
