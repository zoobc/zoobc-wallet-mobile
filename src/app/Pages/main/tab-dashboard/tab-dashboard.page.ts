import { Component, OnInit } from "@angular/core";
import {
  LoadingController,
  MenuController,
  NavController
} from "@ionic/angular";
import { AccountService } from "src/app/Services/account.service";
import { TransactionService } from "src/app/Services/transaction.service";
import { Account } from "src/app/Interfaces/account";
import { ThemeService } from "src/app/Services/theme.service";
import { AuthService } from "src/app/Services/auth.service";

@Component({
  selector: "app-tab-dashboard",
  templateUrl: "tab-dashboard.page.html",
  styleUrls: ["tab-dashboard.page.scss"]
})
export class TabDashboardPage implements OnInit {
  data1: any;
  data2: any;

  publicKey = "JkhkUiury9899";

  account: Account = {
    name: "",
    balance: 0,
    address: "",
    created: null
  };

  accountName: string = "";

  balance = 0;
  spendablebalance = 0;
  unconfirmedBalance = 0;

  transactions: any[] = [];
  pendingTransactions: any[] = [];

  constructor(
    private loadingController: LoadingController,
    private authService: AuthService,
    private menuController: MenuController,
    private navCtrl: NavController,
    private accountSrv: AccountService,
    private transactionSrv: TransactionService,
    private themeSrv: ThemeService
  ) {
    this.accountSrv.activeAccountSubject.subscribe({
      next: account => {
        this.account.name = account.name;
        this.account.address = account.address;

        this.getAccountTransaction();
        this.getAccountBalance();
      }
    });
  }

  async ionViewDidEnter() {
    this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.account = await this.accountSrv.getActiveAccount();

    this.getAccountBalance();
    this.getAccountTransaction();
    this.getPendingTransactions();
  }

  async refreshData(refresher) {
    await this.loadData();

    refresher.complete();
  }

  goToSend() {
    this.navCtrl.navigateForward("main/send");
  }

  goToRequest() {
    this.navCtrl.navigateForward("main/receive");
  }

  goToTransaction() {
    this.navCtrl.navigateForward("transaction");
  }

  openAccount() {
    this.navCtrl.navigateForward("account");
  }

  openchart() {
    this.navCtrl.navigateForward("chart");
  }

  openMenu() {
    this.menuController.open("mainMenu");
  }

  logout() {
    this.authService.logout();
    this.navCtrl.navigateForward("login");
  }

  async getAccountBalance() {
    const active_account = await this.accountSrv.getActiveAccount();

    const account = await (<any>(
      this.accountSrv.getAccountBalance(active_account.address)
    ));
    this.balance = account.accountbalance.balance;
    this.spendablebalance = account.accountbalance.spendablebalance;
  }

  async getAccountTransaction() {
    const transactions = await this.transactionSrv.getAll(
      this.account.address,
      5
    );

    this.transactions = transactions.map(v => {
      let type = "plus";
      let address = v.sender;

      if (this.account.address === v.sender) {
        address = v.recipient;
        type = "minus";
      }

      return {
        id: v.id,
        address,
        date: v.transactionDate,
        type: type,
        amount: v.amount
      };
    });
  }

  async getPendingTransactions() {
    const transactions = await this.transactionSrv.getPendingTransaction(
      this.account.address
    );

    this.pendingTransactions = transactions.map(v => {
      let type = "plus";
      let address = v.sender;

      if (this.account.address === v.sender) {
        address = v.recipient;
        type = "minus";
      }

      return {
        id: v.id,
        address,
        date: v.transactionDate,
        type: type,
        amount: v.amount
      };
    });
  }

  openDetailTransction(index) {
    const transObj = this.transactions[index];

    const transId = transObj.id;

    this.navCtrl.navigateForward("transaction/" + transId);
  }
}
