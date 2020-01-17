import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { TransactionService } from "src/app/Services/transaction.service";
import { Account } from "src/app/Interfaces/account";
import { AccountService } from "src/app/Services/account.service";
import * as moment from "moment";

@Component({
  selector: "app-transaction",
  templateUrl: "./transaction.page.html",
  styleUrls: ["./transaction.page.scss"]
})
export class TransactionPage implements OnInit {
  transactions: any[] = [];

  account: Account = {
    name: "",
    balance: 0,
    address: "",
    created: null
  };

  data2: any;

  constructor(
    private transactionSrv: TransactionService,
    private accountSrv: AccountService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.getAccountTransaction();
  }

  openDetailTransction(index) {
    const transObj = this.transactions[index];

    const transId = transObj.id;

    this.navCtrl.navigateForward("transaction/" + transId);
  }

  async getAccountTransaction() {
    const activeAccount = await this.accountSrv.getActiveAccount();

    const transactions = await this.transactionSrv.getAll(
      activeAccount.address
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
}
