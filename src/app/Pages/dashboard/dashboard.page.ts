import { Component, OnInit } from '@angular/core';
import {
  MenuController,
  ToastController,
  LoadingController,
  ModalController
} from '@ionic/angular';
import { Account } from 'src/app/Interfaces/account';
import { AuthService } from 'src/app/Services/auth-service';
import { Router, NavigationExtras } from '@angular/router';
import { TransactionService } from 'src/app/Services/transaction.service';
import { TransactionDetailPage } from 'src/app/Pages/transaction-detail/transaction-detail.page';
import { CurrencyService, Currency } from 'src/app/Services/currency.service';
import { AccountService } from 'src/app/Services/account.service';
import { BLOCKCHAIN_BLOG_URL, CONST_DEFAULT_RATE, NETWORK_LIST, DEFAULT_THEME } from 'src/environments/variable.const';
import zoobc from 'zoobc';
import { Transaction } from 'src/app/Interfaces/transaction';

import { FcmService } from 'src/app/Services/fcm.service';
import { ThemeService } from 'src/app/Services/theme.service';
import { FcmIdentity } from 'src/app/Interfaces/fcm-identity';
import { ChatService } from 'src/app/Services/chat.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  identity: FcmIdentity;
  clickSub: any;
  public errorMsg: string;
  public offset: number;

  public accountBalance: any;
  public isLoadingBalance: boolean;
  public currencyRate = CONST_DEFAULT_RATE;
  public priceInUSD: number;
  public totalTx: number;
  public recentTx: Transaction[];
  public unconfirmTx: Transaction[];
  public isError = false;
  public navigationSubscription: any;

  account: Account;
  accounts: Account[];
  notifId = 1;
  theme = DEFAULT_THEME;

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router,
    public modalCtrl: ModalController,
    private menuController: MenuController,
    public loadingController: LoadingController,
    private transactionServ: TransactionService,
    private currencyServ: CurrencyService,
    public toastController: ToastController,
    private fcmService: FcmService,
    private themeSrv: ThemeService,
    private chatService: ChatService
  ) {

    // if account changed
    this.accountService.accountSubject.subscribe(() => {
      this.loadData();
    });


    // if account changed
    this.themeSrv.themeSubject.subscribe(() => {
      this.theme = this.themeSrv.theme;
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

    // this.loadData();
  }

  doRefresh(event: any) {
    this.showLoading();
    this.loadData();

    setTimeout(() => {
      event.target.complete();
    }, 2000);

  }

  async ngOnInit() {
    this.theme = this.themeSrv.theme;
    console.log('==== theme:', this.theme);
    this.loadData();
    // this.account = await this.accountService.getCurrAccount();
  }


  async loadData() {

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
    this.totalTx = 0;
    this.recentTx = [];
    this.unconfirmTx = [];
    this.isError = false;

    this.account = await this.accountService.getCurrAccount();
    this.currencyRate = this.currencyServ.getRate();
    zoobc.Network.list(NETWORK_LIST);
    this.getBalanceByAddress(this.account.address);
    await this.fcmService.getToken(this.account);
    this.identity = this.fcmService.identity;
    this.chatService.subscribeNotif(this.account.address);
  }

  /**
   * Get balance of current active address
   * @ param address
   */
  async getBalanceByAddress(address: string) {
    this.isError = false;
    const date1 = new Date();
    this.isLoadingBalance = true;

    await zoobc.Account.getBalance(address)
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

  openDetailUnconfirm(trx) {
    this.loadDetailTransaction(trx, 'pending');
  }

  openDetailTransction(trx) {
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

  /**
   * Load detail transaction
   * @ param trx
   * @ param trxStatus
   */
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

  openBlog() {
    window.open(BLOCKCHAIN_BLOG_URL, '_system');
  }

}
