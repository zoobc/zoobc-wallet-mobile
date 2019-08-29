import { Component, OnInit, NgZone } from "@angular/core";
import {
  LoadingController,
  MenuController,
  NavController,
  ModalController
} from "@ionic/angular";
import { RestapiService } from "../../../Services/restapi.service";
import { AuthService } from "src/app/Services/auth-service";
import { Router, NavigationExtras } from "@angular/router";
import { AccountService } from "src/app/Services/account.service";
import { GRPCService } from "src/app/Services/grpc.service";
import { Storage } from "@ionic/storage";
import { ActiveAccountService } from "src/app/Services/active-account.service";
import { Observable } from "rxjs";
import * as moment from "moment";
import { NavigationOptions } from "@ionic/angular/dist/providers/nav-controller";
import { TransactionService } from "src/app/Services/transaction.service";
import { Transaction } from "src/app/grpc/model/transaction_pb";

@Component({
  selector: "app-tab-dashboard",
  templateUrl: "tab-dashboard.page.html",
  styleUrls: ["tab-dashboard.page.scss"]
})
export class TabDashboardPage implements OnInit {
  data1: any;
  data2: any;

  publicKey = "JkhkUiury9899";

  account = {
    accountName: "",
    address: ""
  };

  accountName: string = "";

  balance = 0;
  spendablebalance = 0;
  unconfirmedBalance = 0;

  transactions: any[] = [];

  constructor(
    private apiservice: RestapiService,
    private loadingController: LoadingController,
    private authService: AuthService,
    private router: Router,
    private menuController: MenuController,
    private navCtrl: NavController,
    private grpcService: GRPCService,
    private storage: Storage,
    private accountService: AccountService,
    private activeAccountSrv: ActiveAccountService,
    private zone: NgZone,
    private modalController: ModalController,
    private transactionSrv: TransactionService
  ) {
    this.activeAccountSrv.accountSubject.subscribe({
      next: v => {
        this.account.accountName = v.accountName;
        this.account.address = this.accountService.getAccountAddress(v);

        this.getAccountTransaction();
        this.getAccountBalance();
      }
    });
  }

  async ionViewDidEnter() {
    this.loadData();
  }

  async ngOnInit() {
    //this.getBalance(this.publicKey);
    //this.getTransaction(this.publicKey);

    this.loadData();
  }

  async loadData() {
    this.getAccountBalance();
    this.getAccountTransaction();

    const account = await this.storage.get("active_account");
    this.account.accountName = account.accountName;
    this.account.address = this.accountService.getAccountAddress(account);

    this.getAccountBalance();
    this.getAccountTransaction();
  }

  goToSend() {
    this.router.navigateByUrl("main/send");
  }

  goToRequest() {
    this.router.navigateByUrl("main/receive");
  }

  async getBalance(pKey: string) {
    const loading = await this.loadingController.create({
      message: "Loading"
    });
    await loading.present();
    this.apiservice.getBalance(pKey).subscribe(
      res => {
        console.log(res);
        this.data1 = res[0];
        this.balance = this.data1["data"];
        loading.dismiss();
      },
      err => {
        console.log(err);
        loading.dismiss();
      }
    );
  }

  async getTransaction(pKey: string) {
    const loading = await this.loadingController.create({
      message: "Loading"
    });
    await loading.present();
    this.apiservice.getAccountTransactions(pKey).subscribe(
      res => {
        console.log(res);
        this.data2 = res[0];
        this.transactions = this.data2["transactions"];
        loading.dismiss();

        console.log("__res", res);
      },
      err => {
        console.log("__resErr", err);
        loading.dismiss();
      }
    );
  }

  openchart() {
    this.navCtrl.navigateForward("chart");
  }

  openMenu() {
    this.menuController.open("mainMenu");
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["login"]);
  }

  async getAccountBalance() {
    const account = await (<any>this.grpcService.getAccountBalance());
    this.balance = account.accountbalance.balance;
    this.spendablebalance = account.accountbalance.spendablebalance;
    // console.log("__balance", balance);
  }

  async getAccountTransaction() {
    const transactions = await this.transactionSrv.getAll(this.account.address);

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

  openDetailTransction(index) {
    const transObj = this.transactions[index];

    const transId = transObj.id;

    this.router.navigate(["transaction/" + transId]);
  }
}
