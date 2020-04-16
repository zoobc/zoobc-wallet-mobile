import { Component, OnInit } from '@angular/core';
import {
  MenuController,
  NavController,
  ToastController,
  LoadingController,
  ModalController
} from '@ionic/angular';
import { AuthService, Account } from 'src/app/Services/auth-service';
import { Router, NavigationExtras } from '@angular/router';
import { TransactionService, Transaction } from 'src/app/Services/transaction.service';
import {
  GetAccountBalanceResponse,
  AccountBalance as AB,
} from 'src/app/Grpc/model/accountBalance_pb';
import { TransactionDetailPage } from 'src/app/Pages/transaction-detail/transaction-detail.page';
import { CurrencyService, Currency } from 'src/app/Services/currency.service';
import { AccountService } from 'src/app/Services/account.service';
import { CONST_DEFAULT_CURRENCY, CONST_DEFAULT_RATE, NETWORK_LIST } from 'src/environments/variable.const';
import zoobc from 'zoobc';

type AccountBalanceList = GetAccountBalanceResponse.AsObject;

@Component({
  selector: 'app-tab-dashboard',
  templateUrl: 'tab-dashboard.page.html',
  styleUrls: ['tab-dashboard.page.scss']
})
export class TabDashboardPage implements OnInit {

  public errorMsg: string;
  public offset: number;

  public accountBalance: any;
  public isLoadingBalance: boolean;
  public isLoadingRecentTx: boolean;
  public currencyRate = CONST_DEFAULT_RATE;
  public priceInUSD: number;
  public totalTx: number;
  public recentTx: Transaction[];
  public unconfirmTx: Transaction[];
  public isError = false;
  public navigationSubscription: any;

  account: Account;
  accounts: Account[];

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router,
    public modalCtrl: ModalController,
    private menuController: MenuController,
    public loadingController: LoadingController,
    private navCtrl: NavController,
    private transactionServ: TransactionService,
    private currencyServ: CurrencyService,
    public toastController: ToastController
  ) {

    // if account changed
    this.accountService.accountSubject.subscribe(() => {
      this.loadData();
    });

    // if post send money reload data
    this.transactionServ.sendMoneySubject.subscribe(() => {
      this.loadData();
    }
    );

    // if network changed reload data
    this.transactionServ.changeNodeSubject.subscribe(() => {
      // console.log(' == change node network ====');
      this.loadData();
    }
    );

    // if currency changed
    this.currencyServ.currencySubject.subscribe((rate: Currency) => {
      this.currencyRate = rate;
    });

    this.loadData();
  }

  doRefresh(event: any) {
    this.showLoading();
    this.loadData();

    setTimeout(() => {
      event.target.complete();
    }, 2000);

  }

  ngOnInit() {
    // this.loadData();
  }


  async loadData() {

    // console.log('=== load data ===');
    this.priceInUSD = this.currencyServ.getPriceInUSD();
    this.accountBalance = {
      accountaddress: '',
      blockheight: 0,
      spendablebalance: 0,
      balance: 0,
      poprevenue: '',
      latest: false
    };

    this.errorMsg = '';
    this.offset = 1;
    this.accountBalance = 0;
    this.isLoadingBalance = true;
    this.isLoadingRecentTx = true;
    this.totalTx = 0;
    this.recentTx = [];
    this.unconfirmTx = [];
    this.isError = false;

    this.account = await this.accountService.getCurrAccount();
    this.currencyRate = this.currencyServ.getRate();

    zoobc.Network.list(NETWORK_LIST);
    this.getBalance();
  }

  openBlog() {
    window.open('https://blogchainzoo.com', '_system');
  }

  async getBalance() {
    this.isError = false;
    const date1 = new Date();
    this.isLoadingBalance = true;

    await zoobc.Account.getBalance(this.account.address)
      .then(data => {
        this.accountBalance = data.accountbalance;
      })
      .catch(error => {
        this.accountBalance = {
          accountaddress: '',
          blockheight: 0,
          spendablebalance: 0,
          balance: 0,
          poprevenue: '',
          latest: false
        };
        this.errorMsg = '';
        this.isError = false;
        if (error === 'error: account not found') {
          // do something here
        } else if (error === 'Response closed without headers') {
          const date2 = new Date();
          const diff = date2.getTime() - date1.getTime();
          // console.log('== diff: ', diff);
          if (diff < 5000) {
            this.errorMsg = 'Please check internet connection!';
          } else {
            this.errorMsg = 'Fail connect to services, please try again later!';
          }

          this.isError = true;
        } else if (error === 'all SubConns are in TransientFailure') {
          this.errorMsg = 'All SubConns are in TransientFailure';
        } else {
          this.errorMsg = error;
        }
        console.error(' ==== have error: ', error);
      })
      .finally(() => (this.isLoadingBalance = false));

    // console.log('==== this.account2: ', this.account.address);
    // await this.transactionServ.getAccountBalance(this.account.address).then((data: AccountBalanceList) => {
    //   this.accountBalance = data.accountbalance;
    // }).catch((error) => {
    //   this.accountBalance = {
    //     accountaddress: '',
    //     blockheight: 0,
    //     spendablebalance: 0,
    //     balance: 0,
    //     poprevenue: '',
    //     latest: false
    //   };
    //   this.errorMsg = '';
    //   this.isError = false;
    //   if (error === 'error: account not found') {
    //     // do something here
    //   } else if (error === 'Response closed without headers') {
    //     const date2 = new Date();
    //     const diff = date2.getTime() - date1.getTime();
    //     // console.log('== diff: ', diff);
    //     if (diff < 5000) {
    //       this.errorMsg = 'Please check internet connection!';
    //     } else {
    //       this.errorMsg = 'Fail connect to services, please try again later!';
    //     }

    //     this.isError = true;
    //   } else if (error === 'all SubConns are in TransientFailure') {
    //     // do something here
    //   } else {

    //   }

    //   console.error(' ==== have error: ', error);
    // }).finally(() => {
    //   this.isLoadingBalance = false;

    //   // TODO REMOVE THIS
    //   // this.accountBalance = {
    //   //   accountaddress: '',
    //   //   blockheight: 0,
    //   //   spendablebalance: 3000000000,
    //   //   balance: 2000000000,
    //   //   poprevenue: '',
    //   //   latest: false
    //   // };

    // });
  }

  goToSend() {
    this.router.navigateByUrl('tabs/send');
  }

  goToRequest() {
    this.router.navigateByUrl('tabs/receive');
  }

  openchart() {
    this.navCtrl.navigateForward('chart');
  }

  openMenu() {
    this.menuController.open('mainMenu');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  openSendFeedbak() {
    this.router.navigateByUrl('/feedback');
  }

  openListAccount() {
    const navigationExtras: NavigationExtras = {
      state: {
        forWhat: 'account'
      }
    };
    this.router.navigate(['list-account'], navigationExtras);
  }

  async openDetailUnconfirm(trx) {
    this.loadDetailTransaction(trx, 'pending');
  }

  async openDetailTransction(trx) {
    this.loadDetailTransaction(trx, 'confirm');
  }

  showLoading() {
    this.loadingController.create({
      message: 'Loading ...',
      duration: 200
    }).then((res) => {
      res.present();
    });
  }

  async loadDetailTransaction(trx: any, trxStatus: string) {

    this.showLoading();

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
}
