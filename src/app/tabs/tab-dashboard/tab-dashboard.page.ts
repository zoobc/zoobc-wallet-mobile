import { Component, OnInit } from '@angular/core';
import {
  MenuController,
  NavController,
  AlertController,
  ToastController
} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth-service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { Storage } from '@ionic/storage';
import { TransactionService, Transactions, Transaction } from 'src/app/services/transaction.service';
import {
  GetAccountBalanceResponse,
  AccountBalance as AB,
} from 'src/app/grpc/model/accountBalance_pb';
import { ActiveAccountService } from 'src/app/services/active-account.service';

type AccountBalance = AB.AsObject;
type AccountBalanceList = GetAccountBalanceResponse.AsObject;

@Component({
  selector: 'app-tab-dashboard',
  templateUrl: 'tab-dashboard.page.html',
  styleUrls: ['tab-dashboard.page.scss']
})
export class TabDashboardPage implements OnInit {
  public account = {
    accountName: '',
    address: '',
    shortadress: ''
  };

  public accountBalance: any;

  public isLoadingBalance = true;
  public isLoadingRecentTx = true;


  totalTx = 0;
  recentTx: Transaction[];
  unconfirmTx: Transaction[];
  isError = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuController: MenuController,
    private navCtrl: NavController,
    private activeAccountSrv: ActiveAccountService,
    private storage: Storage,
    private accountService: AccountService,
    private transactionServ: TransactionService,
    private alertController: AlertController,
    public toastController: ToastController
  ) {
      this.isLoadingBalance = true;

      this.accountBalance =  {
        accountaddress: '',
        blockheight: 0,
        spendablebalance: 0,
        balance: 0,
        poprevenue: '',
        latest: false
      };

      this.activeAccountSrv.accountSubject.subscribe({
      next: v => {
        this.account.accountName = v.accountName;
        this.account.address = this.accountService.getAccountAddress(v);
        this.account.shortadress = this.shortAddress(this.account.address);
        this.getBalance();
        this.getTransactions();
      }
    });

  }

  shortAddress(addrs: string) {
    return addrs.substring(0, 10).concat('...').concat(addrs.substring(addrs.length - 10, addrs.length));
  }

  doRefresh(event) {
    this.loadData();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

   ionViewDidEnter() {
    this.loadData();
  }

   ngOnInit() {
    this.loadData();
  }

  async loadData() {

    this.isError = false;

    const account = await this.storage.get('active_account');
    this.account.accountName = account.accountName;
    this.account.address = this.accountService.getAccountAddress(account);
    this.account.shortadress = this.shortAddress(this.account.address);

    this.getBalance();
    this.getTransactions();
  }

  getTransactions() {
    this.isLoadingRecentTx = true;
    this.transactionServ
      .getAccountTransaction(1, 100, this.account.address )
      .then((res: Transactions) => {
        this.totalTx = res.total;
        this.recentTx = res.transactions;
        this.isLoadingRecentTx = false;
      });

    this.transactionServ
      .getUnconfirmTransaction(this.account.address)
      .then((res: Transaction[]) => (this.unconfirmTx = res));
  }

  getBalance() {
    this.isError = false;

    this.isLoadingBalance = true;
    this.transactionServ.getAccountBalance(this.account.address).then((data: AccountBalanceList) => {
      this.accountBalance = data.accountbalance;
      this.isLoadingBalance = false;
    }).catch((error) => {

      if (error === 'error: account not found'){
        this.accountBalance =  {
          accountaddress: '',
          blockheight: 0,
          spendablebalance: 0,
          balance: 0,
          poprevenue: '',
          latest: false
        };
        this.isError = false;

      } else if (error === 'Response closed without headers') {
        this.accountBalance =  {
          accountaddress: '',
          blockheight: 0,
          spendablebalance: 0,
          balance: 0,
          poprevenue: '',
          latest: false
        };
        this.isError = true;
      }
      
      this.isLoadingBalance = false;

      console.error(" ==== ada eror", error);
    });
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

  openListAccount() {
    this.navCtrl.navigateForward('list-account');
  }

  openDetailUnconfirm(index){
    const trxUnconfirm = this.unconfirmTx[index];
    console.log('======== Unconfirm: ', trxUnconfirm);
    this.showUnconfirmDetail(trxUnconfirm);
  }

  openDetailTransction( transId) {
    this.router.navigate(['transaction/' + transId]);
  }

  timeConverter(unixTimestamp: number) {
    const a = new Date(unixTimestamp);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }

  async showUnconfirmDetail(trx: any) {
    console.log('--- timestamp: ' + trx.timestamp);

    const formattedTime = this.timeConverter(trx.timestamp);

    const typeTrx = trx.type === 'send' ? 'Send to' : 'Receive from ';
    const alert = await this.alertController.create({
      cssClass: 'alert-zbc',
      header: 'Detail',
      message: '<div>'
      + 'Date:</br><strong>' + formattedTime +  '</strong></br></br>'
      + '' + typeTrx + '</br><strong>' + trx.address + '</strong></br></br>'
      + 'Amount:</br><strong>' + (Number(trx.amount) / 1e8) + '</strong></br></br>'
      + 'Fee:</br><strong>' + (Number(trx.fee) / 1e8) + '</strong></br></br>'
      + 'Total:</br><strong>' + ((Number(trx.amount) + Number(trx.fee)) / 1e8) + '</strong></br></br>'
      + 'Status:</br><b>' + 'Pending' + '</b></br></br>'
      + '</div>',
      buttons: [
        {
          text: 'Close',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }


}
