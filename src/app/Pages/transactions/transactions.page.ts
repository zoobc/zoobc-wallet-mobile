import { Component, OnInit } from '@angular/core';
import { makeShortAddress } from 'src/Helpers/converters';
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
import { CurrencyService} from 'src/app/Services/currency.service';
import { NUMBER_OF_RECORD_IN_TRANSACTIONS,
  CONST_DEFAULT_RATE,
  NETWORK_LIST} from 'src/environments/variable.const';
import zoobc, {
  TransactionListParams,
  toTransactionListWallet,
  MempoolListParams,
  toUnconfirmedSendMoneyWallet,
  EscrowListParams,
  OrderBy,
  TransactionType,
} from 'zoobc-sdk';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/Interfaces/transaction';
import { Currency } from 'src/app/Interfaces/currency';
import { NetworkService } from 'src/app/Services/network.service';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
import { GetEscrowTransactionsResponse } from 'zoobc-sdk/grpc/model/escrow_pb';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss']
})
export class TransactionsPage implements OnInit {
  account: Account;
  errorMsg: string;
  page: number;
  accountBalance: any;
  // isLoadingBalance: boolean;
  isLoadingRecentTx: boolean;
  currencyRate = CONST_DEFAULT_RATE;
  priceInUSD: number;
  totalTx: number;
  recentTxs = [];
  unconfirmTxs: Transaction[];
  isError = false;
  navigationSubscription: any;
  isErrorRecentTx: boolean;
  addresses = [];
  alertConnectionTitle = '';
  alertConnectionMsg = '';
  networkSubscription = null;
  total: number;
  escrowTransactions: any;
  isLoading: boolean;

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
    private alertCtrl: AlertController
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
    this.networkSrv.changeNodeSubject.subscribe(() => {
      this.loadData();
    });

    // if currency changed
    this.currencyServ.currencySubject.subscribe((rate: Currency) => {
      this.currencyRate = rate;
    });
  }

  doRefresh(event: any) {
    this.showLoading();
    this.loadData();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  ngOnInit() {
    this.getAllAddress();
    this.loadData();
    this.getAllAccount();
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
    this.currencyRate = this.currencyServ.getRate();
    this.getUnconfirmTransactions(this.account.address);
    this.getTransactions(this.account.address);
    this.getEscrowTransaction();
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
      accounts.forEach((obj: { name: any; address: string }) => {
        const app = {
          name: obj.name,
          address: obj.address
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
      transactionType: TransactionType.SENDMONEYTRANSACTION,
      pagination: {
        page: this.page,
        limit: NUMBER_OF_RECORD_IN_TRANSACTIONS,
      },
    };


    try {

      const trxList = await zoobc.Transactions.getList(params);

      let lastHeight = 0;
      let firstHeight = 0;
      if (Number(trxList.total) > 0) {
        lastHeight = trxList.transactionsList[0].height;
        firstHeight = trxList.transactionsList[trxList.transactionsList.length - 1].height;
      }

      const multisigTx = trxList.transactionsList
      .filter(trx => trx.multisigchild === true)
      .map(trx => trx.id);

      const paramEscrowSend: EscrowListParams = {
        sender: address,
        // blockHeightStart: firstHeight,
        // blockHeightEnd: lastHeight,
        statusList: [0, 1, 2, 3],
      };

      const paramEscrowReceive: EscrowListParams = {
        recipient: address,
        // blockHeightStart: firstHeight,
        // blockHeightEnd: lastHeight,
        statusList: [0, 1, 2, 3],
      };

      const escrowSend = await zoobc.Escrows.getList(paramEscrowSend);
      const escrowReceive = await zoobc.Escrows.getList(paramEscrowReceive);

      const escrowList = escrowSend.escrowsList.concat(escrowReceive.escrowsList);
      const tx = toTransactionListWallet(trxList, address);
      tx.transactions.map(recent => {
        recent['alias'] = this.getName(recent.address);
        recent['escrow'] = recent['escrow'] = this.checkIdOnEscrow(recent.id, escrowList);
        if (recent['escrow']) {
          recent['escrowStatus'] = this.getEscrowStatus(recent.id, escrowList); 
        }
        recent['multisigchild'] = multisigTx.includes(recent.id);
        recent['shortaddress'] =  makeShortAddress(recent.address);
        return recent;
      });
      this.total = tx.total;
      this.recentTxs = this.recentTxs.concat(tx.transactions);
      // ---------------

    } catch {
      this.isError = true;
    } finally {
      this.isLoadingRecentTx = false;
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

  getEscrowTransaction() {
    this.isLoading = true;
    const params: EscrowListParams = {
      approverAddress: this.account.address,
      // statusList: [0],
      pagination: {
        page: this.page,
        limit: 1000,
        orderBy: OrderBy.DESC,
        orderField: 'timeout',
      },
    };

    zoobc.Escrows.getList(params)
      .then((res: GetEscrowTransactionsResponse.AsObject) => {
        this.total = Number(res.total);

        const trxs = res.escrowsList.filter(tx => {
          if (tx.latest === true) { return tx; }
        });

        const txMap = trxs.map(tx => {
          const alias = this.getName(tx.recipientaddress) || '';
          return {
            id: tx.id,
            alias,
            senderaddress: makeShortAddress(tx.senderaddress),
            recipientaddress: makeShortAddress(tx.recipientaddress),
            approveraddress: makeShortAddress(tx.approveraddress),
            amount: tx.amount,
            commission: tx.commission,
            timeout: Number(tx.timeout),
            status: tx.status,
            blockheight: tx.blockheight,
            latest: tx.latest,
            instruction: tx.instruction
          };
        });
        this.escrowTransactions = txMap.filter( s => s.status === 1);
      })
      .catch(err => {
        console.log(err);
      }).finally( () => {
        this.isLoading = false;
      });
  }

  /**
   * Get Unconfirm transaction by address
   * @ param address
   */
  private async getUnconfirmTransactions(address: string) {
    const mempoolParams: MempoolListParams = { address };
    this.unconfirmTxs = await zoobc.Mempool.getList(mempoolParams).then(res =>
      toUnconfirmedSendMoneyWallet(res, address)
    );
    console.log('==this.unconfirmTxs: ', this.unconfirmTxs);
  }

  /**
   * Open detail Unconfirm transactin
   * @param trx is unconfirm transaction object
   */
  public async openDetailUnconfirm(trx) {
    this.loadDetailTransaction(trx, 'pending');
  }

  /**
   * Open detail of tranasaction
   * @param trx is tranaction object
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
}
