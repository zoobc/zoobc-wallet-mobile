import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  public sendMoneySubject: Subject<any> = new Subject<any>();
  public transactionSuccessSubject: Subject<boolean> = new Subject<boolean>();

  constructor() {
  }

  transactionFees(minimumFee: number) {
    const fees = [{
        name: 'Regular',
        fee: minimumFee
      }];
    return fees;
  }

  setTransactionSuccess() {
    this.transactionSuccessSubject.next(true);
  }
}
