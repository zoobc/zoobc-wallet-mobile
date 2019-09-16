import { Component, OnInit } from "@angular/core";
import { Transaction } from "src/app/Interfaces/transaction";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NavigationOptions } from "@ionic/angular/dist/providers/nav-controller";
import { TransactionService } from "src/app/services/transaction.service";
import { ActiveAccountService } from "src/app/services/active-account.service";
import { AccountService } from "src/services/account.service";

@Component({
  selector: "app-transaction-detail",
  templateUrl: "./transaction-detail.page.html",
  styleUrls: ["./transaction-detail.page.scss"]
})
export class TransactionDetailPage implements OnInit {
  transaction: Transaction = {
    id: null,
    type: null,
    sender: "",
    recipient: "",
    amount: 0,
    fee: 0,
    total: 0,
    transactionDate: null
  };

  accountAddress: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private transactionSrv: TransactionService,
    private activeAccountSrv: ActiveAccountService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.activeAccountSrv.accountSubject.subscribe({
      next: v => {
        this.accountAddress = this.accountService.getAccountAddress(v);
      }
    });

    this.activatedRoute.params.subscribe(params => {
      if (params.transId) {
        this.transactionDetail(params.transId);
      }
    });
  }

  async transactionDetail(transId) {
    const transactionObj = await (<any>(
      this.transactionSrv.getOne(transId, this.accountAddress)
    ));

    this.transaction = {
      id: transactionObj.id,
      type: transactionObj.type,
      sender: transactionObj.sender,
      recipient: transactionObj.recipient,
      amount: transactionObj.amount,
      fee: transactionObj.fee,
      total: (transactionObj.amount + transactionObj.fee),
      transactionDate: new Date()
    };
  }
}
