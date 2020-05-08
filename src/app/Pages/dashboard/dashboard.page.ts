import { Component, OnInit } from '@angular/core';
import {
  MenuController,
  ToastController,
  LoadingController,
  ModalController
} from '@ionic/angular';
import { Account } from 'src/app/Interfaces/Account';
import { AuthService } from 'src/app/Services/auth-service';
import { Router, NavigationExtras } from '@angular/router';
import { TransactionService } from 'src/app/Services/transaction.service';
import { TransactionDetailPage } from 'src/app/Pages/transaction-detail/transaction-detail.page';
import { CurrencyService, Currency } from 'src/app/Services/currency.service';
import { AccountService } from 'src/app/Services/account.service';
import { BLOCKCHAIN_BLOG_URL, CONST_DEFAULT_RATE, NETWORK_LIST } from 'src/environments/variable.const';
import zoobc from 'zoobc';
import { Transaction } from 'src/app/Interfaces/transaction';
import { FIREBASE_CHAT } from 'src/environments/variable.const';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { Chat } from 'src/app/Models/chatmodels';
import { ChatService } from 'src/app/Services/chat.service';
import { FcmService } from 'src/app/Services/fcm.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {


  clickSub: any;
  public errorMsg: string;
  public offset: number;
  chatLength = 0;

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
  notifId = 1;

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router,
    public modalCtrl: ModalController,
    private menuController: MenuController,
    public loadingController: LoadingController,
    private transactionServ: TransactionService,
    private currencyServ: CurrencyService,
    private chatService: ChatService,
    public toastController: ToastController,
    private localNotifications: LocalNotifications,
    private fcm: FcmService,
    private db: AngularFirestore,
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
    this.loadData();
    this.account = await this.accountService.getCurrAccount();
    this.subscribeNotif(this.account.address);
  }


  subscribeNotif(address) {

    console.log('============ CURRENT ADDRESS ====: ', address);
    this.db
      .collection<Chat>(FIREBASE_CHAT, res => {
        return res.where('pair', '==', address).orderBy('time').limit(1000);
      }).valueChanges()
      .subscribe(chats => {
        console.log('... Receive Chat ...', chats.length);
        console.log('==== Current chat partner: ', this.chatService.currentChatPartner);
        const max = chats.length;
        if (max > this.chatLength) {
          console.log('=== max: ', max);
          const times = chats[max - 1];
          console.log('=== Max time: ', times);
          this.showNotif(chats);
          this.chatLength = chats.length;
        }

      });
  }

  showNotif(chats: Chat[]) {
    setTimeout(() => {
      this.chat_notification(chats);
    }, 100);
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
    this.currencyRate = this.currencyServ.getRate();
    zoobc.Network.list(NETWORK_LIST);
    this.getBalanceByAddress(this.account.address);
    this.fcm.getToken(this.account);
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

  unsub() {
    this.clickSub.unsubscribe();
  }

  chat_notification(chats: Chat[]) {
    this.clickSub = this.localNotifications.on('click').subscribe(data => {
      console.log(data);
      this.router.navigateByUrl('/chat');
      // this.presentAlert('Your notifiations contains a secret = ' + data.data.secret);
      this.unsub();
    });

    // Schedule a single notification
    this.localNotifications.schedule({
      id: this.notifId++,
      text: 'You have ' + (chats.length - this.chatLength) + 'chat',
      sound: 'file://sound.mp3',
      data: chats
    });
  }


}
