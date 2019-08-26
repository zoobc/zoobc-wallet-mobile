import { Component, OnInit, NgZone } from "@angular/core";
import {
  LoadingController,
  MenuController,
  NavController,
  ModalController
} from "@ionic/angular";
import { RestapiService } from "../../../services/restapi.service";
import { AuthService } from "src/services/auth-service";
import { Router } from "@angular/router";
import { AccountService } from "src/services/account.service";
import { GRPCService } from "src/services/grpc.service";
import { Storage } from "@ionic/storage";
import { ActiveAccountService } from "src/app/Services/active-account.service";
import { Observable } from "rxjs";
import * as moment from "moment";

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

  balance = 18.0;
  spendablebalance = 0;
  unconfirmedBalance = 10.0;

  transactions: any = [];

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
    private modalController: ModalController
  ) {
    this.activeAccountSrv.accountSubject.subscribe({
      next: v => {
        this.account.accountName = v.accountName;
        this.account.address = this.accountService.getAccountAddress(v);
      }
    });
  }

  async ngOnInit() {
    //this.getBalance(this.publicKey);
    //this.getTransaction(this.publicKey);

    this.getAccountBalance();
    this.getAccountTransaction();

    const account = await this.storage.get("active_account");

    this.account.accountName = account.accountName;
    this.account.address = this.accountService.getAccountAddress(account);
  }

  goToSend() {
    this.router.navigateByUrl("tabs/send");
  }

  goToRequest() {
    this.router.navigateByUrl("tabs/receive");
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
    const accountTrans = await (<any>this.grpcService.getAccountTransaction());

    this.transactions = accountTrans;
    // this.transactions = accountTrans.map((v: any) => {
    //   var time = new Date(v.timestamp * 1000);

    //   let type = "minus";
    //   let rec = v.recipientpublickey;

    //   if (this.publicKey === v.recipientpublickey) {
    //     type = "plus";
    //   }

    //   return {
    //     title: rec,
    //     date: moment(time).format("MMM Do YY"),
    //     type: type,
    //     amount: v.amountnqt
    //   };
    // });
  }

  openDetailTransction() {
    this.navCtrl.navigateForward("transaction-detail");
  }
}
