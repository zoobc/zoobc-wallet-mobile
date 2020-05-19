import { Component, OnInit } from '@angular/core';
import { makeShortAddress } from 'src/Helpers/converters';
import {
  ToastController,
  LoadingController,
  ModalController
} from '@ionic/angular';
import { Account } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
import { TransactionService } from 'src/app/Services/transaction.service';
import { TransactionDetailPage } from 'src/app/Pages/transaction-detail/transaction-detail.page';
import { CurrencyService} from 'src/app/Services/currency.service';
import { NUMBER_OF_RECORD_IN_TRANSACTIONS,
   CONST_DEFAULT_RATE, 
   NETWORK_LIST} from 'src/environments/variable.const';
import zoobc, {
  TransactionListParams,
  toTransactionListWallet,
  MempoolListParams,
  toUnconfirmedSendMoneyWallet,
} from 'zoobc';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/Interfaces/transaction';
import { Currency } from 'src/app/Interfaces/currency';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {

  account: Account;
  errorMsg: string;
  page: number;
  accountBalance: any;
  // isLoadingBalance: boolean;
  isLoadingRecentTx: boolean;
  currencyRate =  CONST_DEFAULT_RATE;
  priceInUSD: number;
  totalTx: number;
  recentTxs: Transaction[];
  unconfirmTxs: Transaction[];
  isError = false;
  navigationSubscription: any;
  isErrorRecentTx: boolean;

  constructor(
    private router: Router,
    public modalCtrl: ModalController,
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

  private async loadData() {
    this.page = 1;
    this.accountBalance = {
      accountaddress: '',
      blockheight: 0,
      spendablebalance: 0,
      balance: 0,
      poprevenue: '',
      latest: false
    };

    this.errorMsg = '';
    this.accountBalance = 0;
    this.isLoadingRecentTx = true;
    this.totalTx = 0;
    this.recentTxs = [];
    this.unconfirmTxs = [];
    this.isError = false;

    this.priceInUSD = this.currencyServ.getPriceInUSD();
    this.account = await this.accountService.getCurrAccount();
    this.currencyRate =  this.currencyServ.getRate();
    this.getUnconfirmTransactions(this.account.address);
    this.getTransactions(this.account.address);
  }

  /**
   * Get more transactions
   * @param event
   */
  async loadMoreData(event) {
    if (this.recentTxs && this.recentTxs.length < this.totalTx) {
      this.page++;
      this.getTransactions(this.account.address);
    }

    setTimeout(async () => {
      if (this.recentTxs && this.recentTxs.length >= this.totalTx) {
        event.target.complete();
        event.target.disabled = true;
      }
    }, 1000);
  }

  /**
   * Get list transaction of current account address
   * @ param address
   */
  private async getTransactions(address: string) {
      this.isLoadingRecentTx = true;
      this.isErrorRecentTx = false;
      const params: TransactionListParams = {
        address,
        transactionType: 1,
        pagination: {
          page: this.page,
          limit: NUMBER_OF_RECORD_IN_TRANSACTIONS,
        },
      };

      try {
        const tx = await zoobc.Transactions.getList(params).then(res =>
          toTransactionListWallet(res, this.account.address)
        );
        const trxs: Transaction[] =  tx.transactions.map( (recent) => {
          return {
            ...recent,
            sender: recent.type === 'receive' ? recent.address : address,
            recipient: recent.type === 'receive' ? address : recent.address,
            total: 0,
            shortaddress: makeShortAddress(recent.address)
          };
        });

        this.totalTx = tx.total;
        this.recentTxs = this.recentTxs.concat(trxs);
      } catch {
        this.isError = true;
      } finally {
        this.isLoadingRecentTx = false;
      }

  }

  /**
   * Get Unconfirm transaction by address
   * @ param address
   */
  private async getUnconfirmTransactions(address: string){
    const mempoolParams: MempoolListParams = { address };
    this.unconfirmTxs = await zoobc.Mempool.getList(mempoolParams).then(res =>
      toUnconfirmedSendMoneyWallet(res, address)
    );
  }

  /**
   * Open detail Unconfirm transactin 
   * @param trx
   */
  public async openDetailUnconfirm(trx) {
    this.loadDetailTransaction(trx, 'pending');
  }

  /**
   * Open detail of tranasaction
   * @param trx
   */
  public async openDetailTransction(trx) {
    this.loadDetailTransaction(trx, 'confirm');
  }

  private showLoading() {
    this.loadingController.create({
      message: 'Loading ...',
      duration: 500
    }).then((res) => {
      res.present();
    });
  }

  public async loadDetailTransaction(trx: any, trxStatus: string) {

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


  public goDashboard() {
    this.router.navigate(['/dashboard']);
  }

}
