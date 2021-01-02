import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
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
    private navCtrl: NavController,
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
    this.navCtrl.pop();
  }
}
