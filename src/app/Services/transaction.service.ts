import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SendMoneyInterface, ZBCTransaction } from 'zbc-sdk';
import { Transaction } from '../Interfaces/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  public sendMoneySubject: Subject<any> = new Subject<any>();
  public transactionSuccessSubject: Subject<boolean> = new Subject<boolean>();
  frmSend: any;
  tempTrx: ZBCTransaction;
  constructor() {
  }

  transactionFees(minimumFee: number) {
    const fees = [{
        name: 'Regular',
        fee: minimumFee
      }];
    return fees;
  }

  saveTrx(trx: any) {
    this.frmSend = trx;
  }

  getTrx() {
    return this.frmSend ;
  }

}
