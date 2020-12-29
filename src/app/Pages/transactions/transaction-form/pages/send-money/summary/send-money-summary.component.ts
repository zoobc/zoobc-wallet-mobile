import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/Services/transaction.service';

@Component({
  selector: 'app-send-money-summary',
  templateUrl: './send-money-summary.component.html',
  styleUrls: ['./send-money-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SendMoneySummaryComponent implements OnInit {
  constructor(
    private transactionSrv: TransactionService,
    private router: Router
  ) {}

  stateValue: any;
  total = 0;

  ngOnInit() {
    this.stateValue = this.router.getCurrentNavigation().extras.state;
    console.log('===34   this.stateValue',   this.stateValue);
    this.total = this.stateValue.amount + this.stateValue.fee;
  }

  submit() {
    this.transactionSrv.setTransactionSuccess();
  }
}
