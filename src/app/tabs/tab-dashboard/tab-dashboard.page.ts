import { Component, OnInit } from '@angular/core';
import {
  MenuController,
  NavController
} from '@ionic/angular';
import { AuthService } from 'src/services/auth-service';
import { Router } from '@angular/router';
import { AccountService } from 'src/services/account.service';
import { Storage } from '@ionic/storage';
import { TransactionService, Transactions, Transaction } from 'src/app/services/transaction.service';
import {
  GetAccountBalanceResponse,
  AccountBalance as AB,
} from 'src/app/grpc/model/accountBalance_pb';

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

  public accountBalance: AccountBalance;
  public isLoadingBalance = true;
  public isLoadingRecentTx = true;

  public transactions: any[] = [];
  public pendingtrxs: any[] = [];

  totalTx = 0;
  recentTx: Transaction[];
  unconfirmTx: Transaction[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuController: MenuController,
    private navCtrl: NavController,
    private storage: Storage,
    private accountService: AccountService,
    private transactionServ: TransactionService
  ) {
      this.isLoadingBalance = true;
  }

  shortAddress(addrs: string) {
    return addrs.substring(0, 10).concat('...').concat(addrs.substring(addrs.length - 10, addrs.length));
  }

  async doRefresh(event) {
    this.loadData();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  async ionViewDidEnter() {
    this.loadData();
  }

  async ngOnInit() {
    this.loadData();
  }

  async loadData() {
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
      .getAccountTransaction(1, 5, this.account.address )
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
    this.isLoadingBalance = true;
    this.transactionServ.getAccountBalance(this.account.address).then((data: AccountBalanceList) => {
      this.accountBalance = data.accountbalance;
      this.isLoadingBalance = false;
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

  openDetailTransction(index) {
    const transObj = this.transactions[index];
    const transId = transObj.id;
    this.router.navigate(['transaction/' + transId]);
  }
}
