import { Component, OnInit } from '@angular/core';
import {
  MenuController,
  NavController
} from '@ionic/angular';
import { AuthService } from 'src/services/auth-service';
import { Router } from '@angular/router';
import { AccountService } from 'src/services/account.service';
import { GRPCService } from 'src/services/grpc.service';
import { Storage } from '@ionic/storage';
import { ActiveAccountService } from 'src/app/services/active-account.service';
import { TransactionService } from 'src/app/services/transaction.service';

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

  public balance = 0;
  public spendablebalance = 0;
  public unconfirmedBalance = 0;

  public transactions: any[] = [];
  public pendingtrxs: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuController: MenuController,
    private navCtrl: NavController,
    private grpcService: GRPCService,
    private storage: Storage,
    private accountService: AccountService,
    private activeAccountSrv: ActiveAccountService,
    private transactionSrv: TransactionService
  ) {

    this.activeAccountSrv.accountSubject.subscribe({
      next: v => {
        this.account.accountName = v.accountName;
        this.account.address = this.accountService.getAccountAddress(v);
        this.account.shortadress = this.shortAddress(this.account.address);
        this.getAccountBalance();
        this.getPendingTransactions();
        this.getAccountTransaction();
      }
    });

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
  }

  async loadData() {
    const account = await this.storage.get('active_account');
    this.account.accountName = account.accountName;
    this.account.address = this.accountService.getAccountAddress(account);
    this.account.shortadress = this.shortAddress(this.account.address);

    this.getAccountBalance();
    this.getPendingTransactions();
    this.getAccountTransaction();
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

  async getAccountBalance() {
    const account = await (this.grpcService.getAccountBalance() as any);
    this.balance = account.accountbalance.balance;
    this.spendablebalance = account.accountbalance.spendablebalance;
  }


  async getPendingTransactions() {
    const unconfirmTrxs = await this.transactionSrv.getUnconfirmTransactions(this.account.address);

    this.pendingtrxs = unconfirmTrxs.map(v => {
        console.log('==pending:',   v);
        return v;

        // return {
        //   address: v.address,
        //   date: v.timestamp,
        //   type: type,
        //   amount: v.amount
        // };

    });
  }


  async getAccountTransaction() {
    const transactions = await this.transactionSrv.getAll(this.account.address);

    this.transactions = transactions.map(v => {
      let trxType = 'minus';
      let address = v.sender;

      if (this.account.address === v.recipient) {
        address = v.recipient;
        trxType = 'plus';
      }

      return {
        id: v.id,
        address,
        date: v.transactionDate,
        type: trxType,
        amount: v.amount
      };
    });
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
