import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/Services/transaction.service';

@Component({
  selector: 'app-send-money-success',
  templateUrl: './send-money-success.page.html',
  styleUrls: ['./send-money-success.page.scss']
})
export class SendMoneySuccessPage implements OnInit {
  constructor(
    private transactionSrv: TransactionService,
    private router: Router
  ) {}

  public stateValue: any;

  ngOnInit() {
    this.stateValue = this.transactionSrv.getTrx();
  }


  done() {
    this.router.navigate(['tabs/home']);
  }
}
