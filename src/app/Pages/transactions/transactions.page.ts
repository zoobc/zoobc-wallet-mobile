import { Component, OnInit } from '@angular/core';
import {
  MenuController,
  NavController,
  ToastController,
  LoadingController,
  ModalController
} from '@ionic/angular';
import { AuthService } from 'src/app/Services/auth-service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/Services/account.service';
import { Storage } from '@ionic/storage';
import { TransactionService, Transactions, Transaction } from 'src/app/Services/transaction.service';
import { ActiveAccountService } from 'src/app/Services/active-account.service';
import { makeShortAddress } from 'src/app/Helpers/converters';
import { TransactionDetailPage } from 'src/app/Pages/transaction-detail/transaction-detail.page';
import { CurrencyService, Currency } from 'src/app/Services/currency.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {

  public account = {
    accountName: '',
    address: '',
    shortadress: ''
  };

  public errorMsg: string;
  public offset: number;

  public accountBalance: any;
  public isLoadingBalance: boolean;
  public isLoadingRecentTx: boolean;

  public currencyRate: Currency = {
    name: 'USD',
    value: 1,
  };

  public priceInUSD: number;
  public totalTx: number;
  public recentTx: Transaction[];
  public unconfirmTx: Transaction[];
  public isError = false;
  public navigationSubscription: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    public modalCtrl: ModalController,
    private menuController: MenuController,
    public loadingController: LoadingController,
    private navCtrl: NavController,
    private activeAccountSrv: ActiveAccountService,
    private storage: Storage,
    private accountService: AccountService,
    private transactionServ: TransactionService,
    private currencyServ: CurrencyService,
    public toastController: ToastController
  ) {

    // if account changed
    this.activeAccountSrv.accountSubject.subscribe({
      next: v => {
        if (v) {
          this.account.accountName = v.accountName;
          this.account.address = this.accountService.getAccountAddress(v);
          this.account.shortadress = makeShortAddress(this.account.address);
          this.loadData();
        }
      }
    });

    // if post send money reload data
    this.transactionServ.sendMoneySubject.subscribe(() => {
      this.loadData();
    }
    );

    // if post send money reload data
    this.transactionServ.changeNodeSubject.subscribe(() => {
      console.log(' node changed ');
      this.loadData();
    }
    );

    // if currency changed
    this.currencyServ.currencySubject.subscribe((rate: Currency) => {
      console.log(' ================== RATE CHANGED TO:', rate);
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

  ionViewDidEnter() {
    console.log('========== get Rpc Url: ', this.transactionServ.getRpcUrl());
    this.loadData();
  }

  ngOnInit() {

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
    this.isLoadingRecentTx = true;
    this.totalTx = 0;
    this.recentTx = [];
    this.unconfirmTx = [];
    this.isError = false;

    const account = await this.storage.get('active_account');
    console.log('==== Active account:', account);

    if (account) {
      this.account.accountName = account.accountName;
      this.account.address = this.accountService.getAccountAddress(account);
      this.account.shortadress = makeShortAddress(this.account.address);
    }
    this.getTransactions();
    this.currencyRate = this.currencyServ.getRate();
  }

  async loadMoreData(event) {

    console.log('==== this.offset:', this.offset);

    if (this.recentTx.length >= this.totalTx) {
      // event.target.complete();
      console.log(' === all loaded', this.recentTx.length + ' - ' + this.totalTx);
      // event.target.disabled = true;
    }

    setTimeout(async () => {
      await this.transactionServ
        .getAccountTransaction(++this.offset, 5, this.account.address)
        .then((res: Transactions) => {
          this.totalTx = res.total;
          this.recentTx.push(...res.transactions);
        }).finally(() => {
          this.isLoadingRecentTx = false;
          event.target.complete();
        }).catch((error) => {
          event.target.complete();
          console.log('===== eroor getAccountTransaction:', error);
        });

    }, 500);

  }

  async getTransactions() {
    this.isLoadingRecentTx = true;

    await this.transactionServ
      .getUnconfirmTransaction(this.account.address)
      .then((res: Transaction[]) => (this.unconfirmTx = res)).finally(() => {
        // wait until unconfirm transaction loading finish.
        // this.isLoadingRecentTx = false;
      }).catch((error) => {
        console.log('===== eroor getUnconfirmTransaction:', error);
      });

    await this.transactionServ
      .getAccountTransaction(this.offset, 5, this.account.address)
      .then((res: Transactions) => {
        this.totalTx = res.total;
        this.recentTx = res.transactions;
      }).finally(() => {
        this.isLoadingRecentTx = false;
      }).catch((error) => {
        console.log('===== eroor getAccountTransaction:', error);
      });

  }


  openMenu() {
    this.menuController.open('mainMenu');
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
      cssClass: 'modal-ZBC',
      componentProps: {
        transaction: trx,
        account: this.account,
        status: trxStatus
      }
    });
    await modal.present();

  }

}
