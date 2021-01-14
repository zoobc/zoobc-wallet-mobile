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
import { CurrencyService} from 'src/app/Services/currency.service';
import { NUMBER_OF_RECORD_IN_TRANSACTIONS,
  CONST_DEFAULT_RATE} from 'src/environments/variable.const';
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
import { Router } from '@angular/router';
import { Transaction } from 'src/app/Interfaces/transaction';
import { Currency } from 'src/app/Interfaces/currency';
import { NetworkService } from 'src/app/Services/network.service';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss']
})
export class TransactionsPage implements OnInit {

  accountHistory: ZBCTransaction[];
  unconfirmTx: ZBCTransaction[];
  txType: number = TransactionType.SENDMONEYTRANSACTION;

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

  /**
   * Get list transaction of current account address
   * @ param address
   */
  // private async getTransactions2(address: string) {
  //   const addrs: Address = {value: address, type: 0};

  //   this.isLoadingRecentTx = true;
  //   this.isErrorRecentTx = false;
  //   const params: TransactionListParams = {
  //     address: addrs,
  //     transactionType: TransactionType.SENDMONEYTRANSACTION,
  //     pagination: {
  //       page: this.page,
  //       limit: NUMBER_OF_RECORD_IN_TRANSACTIONS,
  //     },
  //   };


  //   try {

  //     const trxList = await zoobc.Transactions.getList(params);
  //     this.totalTx = Number(trxList.total);

  //     let lastHeight = 0;
  //     let firstHeight = 0;
  //     if (Number(trxList.total) > 0) {
  //       lastHeight = trxList.transactions[0].height;
  //       firstHeight = trxList.transactions[trxList.transactions.length - 1].height;
  //     }

  //     const multisigTx = trxList.transactions
  //     .filter(trx => trx.multisig === true)
  //     .map(trx => trx.id);

  //     const paramEscrow: EscrowListParams = {
  //       blockHeightStart: firstHeight,
  //       blockHeightEnd: lastHeight,
  //       recipient: addrs,
  //       statusList: [0, 1, 2, 3],
  //       latest: false,
  //       pagination: {
  //         orderBy: OrderBy.DESC,
  //         orderField: 'block_height',
  //       },
  //     };

  //    // this.startMatch = 0;
  //     const escrowTx = await zoobc.Escrows.getList(paramEscrow);
  //     const escrowList = escrowTx.escrowList;
  //     const tx = trxList.transactions;



  //     tx.map(recent => {
  //       recent.senderAlias = this.getName(recent.sender.value) || '';

  //       recent.escrow = recent.escrow = this.checkIdOnEscrow(recent.id, escrowList);
  //       if (recent.escrow) {
  //         recent.escrowStatus = this.getEscrowStatus(recent.id, escrowList);
  //       }

  //       return recent;
  //     });

  //   } catch {
  //     this.isError = true;
  //   } finally {
  //     this.isLoadingRecentTx = false;
  //   }
  // }

  async getTransactions(reload: boolean = false) {
    if (!this.isLoading) {
      // 72 is transaction item's height
    //  const perPage = Math.ceil(window.outerHeight / 72);

      if (reload) {
        this.accountHistory = null;
        this.page = 1;
      }

      this.isLoading = true;
      this.isError = false;
      this.currentAddress = ( await this.accountService.getCurrAccount()).address;
      console.log('=== currentAddress: ', this.currentAddress);
      const txParam: TransactionListParams = {
        address: this.currentAddress,
        transactionType: this.txType,
        pagination: {
          page: this.page,
          limit: NUMBER_OF_RECORD_IN_TRANSACTIONS,
        },
      };

      try {
        const trxList = await zoobc.Transactions.getList(txParam);
        console.log('===n trxList:', trxList);
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

        if (reload) {
          const mempoolParams: MempoolListParams = { address: this.currentAddress };
          this.unconfirmTx = await zoobc.Mempool.getList(mempoolParams).then((res: ZBCTransactions) =>
            res.transactions.map(uc => {
              this.txType = uc.transactionType;
              return uc;
            })
          );
          console.log('== unconfirmTx: ', this.unconfirmTx);
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
   * Get Unconfirm transaction by address
   * @ param address
   */
  private async getUnconfirmTransactions(address: string) {
    // this.unconfirmTxs = [];
    // console.log('==this.unconfirmTxs: ', this.unconfirmTxs);
  }

  /**
   * Open detail Unconfirm transactin
   * @param trx is unconfirm transaction object
   */
  public async openDetailUnconfirm(trx) {
    this.transactionServ.tempTrx = trx;
    this.router.navigate(['/transaction/0']);
  }

  /**
   * Open detail of tranasaction
   * @param trx is tranaction object
   */
  public async openDetailTransction(trx) {
    this.loadDetailTransaction(trx, 'confirmed');
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
