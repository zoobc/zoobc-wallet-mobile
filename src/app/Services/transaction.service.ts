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
      name: 'Regular',
      fee: minimumFee
    }];
    return fees;
  }
}
