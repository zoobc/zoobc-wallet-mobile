import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  public sendMoneySubject: Subject<any> = new Subject<any>();

  constructor() {
  }

  transactionFees(minimumFee: number) {
    const fees = [{
      name: 'Slow',
      fee: minimumFee
    },
    {
      name: 'Average',
      fee: minimumFee * 2
    },
    {
      name: 'Fast',
      fee: minimumFee * 4
    }];
    return fees;
  }
}
