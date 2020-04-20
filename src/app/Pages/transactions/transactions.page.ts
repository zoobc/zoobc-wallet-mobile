import { Component, OnInit } from '@angular/core';
import { makeShortAddress } from 'src/Helpers/converters';
import {
  MenuController,
  ToastController,
  LoadingController,
  ModalController
} from '@ionic/angular';
import { Account } from 'src/app/Services/auth-service';
import { AccountService } from 'src/app/Services/account.service';
import { TransactionService, Transactions, Transaction } from 'src/app/Services/transaction.service';
import { TransactionDetailPage } from 'src/app/Pages/transaction-detail/transaction-detail.page';
import { CurrencyService, Currency } from 'src/app/Services/currency.service';
import { NUMBER_OF_RECORD_IN_TRANSACTIONS, CONST_DEFAULT_CURRENCY,
   CONST_DEFAULT_RATE, 
   NETWORK_LIST} from 'src/environments/variable.const';
import zoobc, {
  TransactionListParams,
  toTransactionListWallet,
  MempoolListParams,
  toUnconfirmedSendMoneyWallet,
} from 'zoobc';
import { AddressBookService } from 'src/app/Services/address-book.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {

  account: Account;
  errorMsg: string;
  offset: number;
  accountBalance: any;
  isLoadingBalance: boolean;
  isLoadingRecentTx: boolean;
  currencyRate =  CONST_DEFAULT_RATE;
  priceInUSD: number;
  totalTx: number;
  recentTx: any;
  unconfirmTx: Transaction[];
  isError = false;
  navigationSubscription: any;
  isErrorRecentTx: boolean;

  constructor(
    public modalCtrl: ModalController,
    private menuController: MenuController,
    public loadingController: LoadingController,
    private accountService: AccountService,
    private transactionServ: TransactionService,
    private currencyServ: CurrencyService,
    private addressBookSrv: AddressBookService,
    public toastController: ToastController
  ) {

    // if account changed
    this.accountService.accountSubject.subscribe(() => {
      this.loadData();
    });

    // if post send money reload data
    this.transactionServ.sendMoneySubject.subscribe(() => {
      this.loadData();
    });

    // if network changed reload data
    this.transactionServ.changeNodeSubject.subscribe(() => {
      // console.log(' node changed ');
      this.loadData();
    });

    // if currency changed
    this.currencyServ.currencySubject.subscribe((rate: Currency) => {
      // console.log(' ================== RATE CHANGED TO:', rate);
      this.currencyRate = rate;
    });
    zoobc.Network.list(NETWORK_LIST);
  }

  doRefresh(event: any) {
    this.showLoading();
    this.loadData();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  ngOnInit() {
    this.loadData();
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

    this.account = await this.accountService.getCurrAccount();
    // console.log('==== Active account:', this.account);
    this.getTransactions();
    this.currencyRate = this.currencyServ.getRate();
  }

  async loadMoreData(event) {

    // console.log('==== this.offset:', this.offset);

    if (this.recentTx.length >= this.totalTx) {
      // event.target.complete();
      // console.log(' === all loaded', this.recentTx.length + ' - ' + this.totalTx);
      // event.target.disabled = true;
    }

    setTimeout(async () => {
      await this.transactionServ
        .getAccountTransaction(++this.offset, NUMBER_OF_RECORD_IN_TRANSACTIONS, this.account.address)
        .then((res: Transactions) => {
          this.totalTx = res.total;
          this.recentTx.push(...res.transactions);
        }).finally(() => {
          this.isLoadingRecentTx = false;
          event.target.complete();
        }).catch((error) => {
          event.target.complete();
          // console.log('===== eroor getAccountTransaction:', error);
        });

    }, 500);

  }

  async getTransactions() {
      this.isLoadingRecentTx = true;

      const addresses = this.addressBookSrv.getAll();

      this.recentTx = null;
      this.unconfirmTx = null;
      this.isErrorRecentTx = false;
      this.isLoadingRecentTx = true;

      console.log('===== Get Transactions ====');

      const params: TransactionListParams = {
        address: this.account.address,
        transactionType: 1,
        pagination: {
          page: this.offset++,
          limit: NUMBER_OF_RECORD_IN_TRANSACTIONS,
        },
      };

      try {
        const tx = await zoobc.Transactions.getList(params).then(res =>
          toTransactionListWallet(res, this.account.address)
        );
        tx.transactions.map(recent => {
          console.log('=== Recent transaction: ', recent);
          recent['sender'] = recent.type === 'receive' ? recent.address : this.account.address;
          recent['recipient'] = recent.type === 'receive' ? this.account.address : recent.address;
          recent['name'] = this.transactionServ.getNameByAddress(recent.address, addresses);
          recent['shortaddress'] = makeShortAddress(recent.address);
        });
        this.totalTx = tx.total;
        this.recentTx = tx.transactions;

        // const mempoolParams: MempoolListParams = { address: this.account.address };
        // this.unconfirmTx = await zoobc.Mempool.getList(mempoolParams).then(res =>
        //      toUnconfirmedSendMoneyWallet(res, this.account.address)
        // );


      } catch {
        this.isError = true;
        this.unconfirmTx = null;
      } finally {
        this.isLoadingRecentTx = false;
      }

    // this.isLoadingRecentTx = true;

    // await this.transactionServ
    //   .getUnconfirmTransaction(this.account.address)
    //   .then((res: Transaction[]) => (this.unconfirmTx = res)).finally(() => {
    //     // wait until unconfirm transaction loading finish.
    //   }).catch((error) => {
    //     console.log('===== eroor getUnconfirmTransaction:', error);
    //   });

    // await this.transactionServ
    //   .getAccountTransaction(this.offset, NUMBER_OF_RECORD_IN_TRANSACTIONS, this.account.address)
    //   .then((res: Transactions) => {
    //     this.totalTx = res.total;
    //     this.recentTx = res.transactions;
    //   }).catch((error) => {
    //     console.log('===== eroor getAccountTransaction:', error);
    //   });

    // this.isLoadingRecentTx = false;
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
