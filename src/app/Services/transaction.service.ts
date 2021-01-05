import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  public sendMoneySubject: Subject<any> = new Subject<any>();
  public transactionSuccessSubject: Subject<boolean> = new Subject<boolean>();
  transaction: any;
  isTrxConfirm = false;
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
    this.transaction = trx;
  }

  getTrx() {
    return this.transaction ;
  }

  setTransactionSuccess() {
    this.isTrxConfirm = true;
    this.transactionSuccessSubject.next(true);
  }
}
