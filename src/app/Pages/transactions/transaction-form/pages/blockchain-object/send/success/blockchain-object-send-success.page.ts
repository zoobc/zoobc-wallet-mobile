import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/Services/transaction.service';

@Component({
  selector: 'app-blockchain-object-send-success',
  templateUrl: './blockchain-object-send-success.page.html',
  styleUrls: ['./blockchain-object-send-success.page.scss']
})
export class BlockchainObjectSendSuccessPage implements OnInit {
  constructor(
    private transactionSrv: TransactionService,
    private router: Router
  ) {}

  public stateValue: any;

  ngOnInit() {
    this.stateValue = this.router.getCurrentNavigation().extras.state;
  }

  submit() {
    this.transactionSrv.setTransactionSuccess();
  }

  done() {
    this.router.navigate(['tabs/home']);
  }
}
