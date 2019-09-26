import { Component, OnInit } from "@angular/core";
import { Transaction } from "src/app/Interfaces/transaction";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NavigationOptions } from "@ionic/angular/dist/providers/nav-controller";
import { TransactionService } from "src/app/Services/transaction.service";
import { ActiveAccountService } from "src/app/Services/active-account.service";
import { AccountService } from "src/app/Services/account.service";
import { AddressBookService } from "src/app/Services/address-book.service";

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
    amount: null,
    fee: null,
    transactionDate: null
  };

  accountAddress: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private transactionSrv: TransactionService,
    private activeAccountSrv: ActiveAccountService,
    private accountSrv: AccountService,
    private addressBookSrv: AddressBookService
  ) {}

  ngOnInit() {
    this.activeAccountSrv.accountSubject.subscribe({
      next: v => {
        this.accountAddress = this.accountSrv.getAccountAddress(v);
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
      blockId: transactionObj.blockId,
      type: transactionObj.type,
      sender: transactionObj.sender,
      senderName: await this.accountSrv.getAddressName(transactionObj.sender),
      recipient: transactionObj.recipient,
      recipientName: await this.addressBookSrv.getAddressName(
        transactionObj.recipient
      ),
      amount: transactionObj.amount,
      fee: transactionObj.fee,
      transactionDate: new Date()
    };
  }
}
