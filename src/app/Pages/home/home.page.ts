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
import { DecimalPipe } from '@angular/common';
import { NetworkService } from 'src/app/Services/network.service';
import { dateAgo } from 'src/Helpers/utils';
import { makeShortAddress } from 'src/Helpers/converters';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';
import zoobc, {
  TransactionListParams,
  toTransactionListWallet,
  MempoolListParams,
  toUnconfirmedSendMoneyWallet,
  TransactionsResponse,
  TransactionType
} from 'zoobc-sdk';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { PopoverAccountComponent } from 'src/app/Components/popover-account/popover-account.component';
import { PopoverBlockchainObjectOptionComponent } from './popover-blockchain-object-option/popover-blockchain-object-option.component';

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
  timeLeft = 12;
  interval: any;
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

  alertConnectionTitle = '';
  alertConnectionMsg = '';
  networkSubscription = null;

  isLoadingRecentTx = false;
  recentTx: any;
  unconfirmTx: any;
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
  }

  async doRefresh(event: any) {
    await this.loadData();
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

  goToTransactionDetail(transactionId) {
    this.router.navigate(['/transaction/' + transactionId]);
  }

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
            recent.alias = await this.addressBookSrv.getNameByAddress(
              recent.address
            );
          });
          this.totalTx = tx.total;

          const params2: MempoolListParams = {
            address: this.account.address
          };

          return zoobc.Mempool.getList(params2);
        })
        .then(
          unconfirmTx =>
            (this.unconfirmTx = toUnconfirmedSendMoneyWallet(
              unconfirmTx,
              this.account.address
            ))
        )
        .catch(() => {
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
