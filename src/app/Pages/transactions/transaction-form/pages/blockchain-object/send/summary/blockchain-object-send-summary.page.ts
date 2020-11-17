import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/Services/transaction.service';

@Component({
  selector: 'app-blockchain-object-send-summary',
  templateUrl: './blockchain-object-send-summary.page.html',
  styleUrls: ['./blockchain-object-send-summary.page.scss'],
})
export class BlockchainObjectSendSummaryPage implements OnInit {
  constructor(
    private transactionSrv: TransactionService,
    private router: Router
  ) {}

  stateValue: any;
  total = 0;

  ngOnInit() {
    this.stateValue = this.router.getCurrentNavigation().extras.state;
    this.total = this.stateValue.amount + this.stateValue.fee;
  }

  submit() {
    this.transactionSrv.setTransactionSuccess();
  }
}
