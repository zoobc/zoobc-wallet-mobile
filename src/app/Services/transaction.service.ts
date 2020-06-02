import { Injectable } from '@angular/core';
import { AddressBookService } from './address-book.service';
import { Subject } from 'rxjs';
import { STORAGE_SELECTED_NODE } from 'src/environments/variable.const';
import { StoragedevService } from './storagedev.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private rpcUrl: string;

  public sendMoneySubject: Subject<any> = new Subject<any>();
  public changeNodeSubject: Subject<any> = new Subject<any>();

  constructor(private strgSrv: StoragedevService) {
    this.loadRpcUrl();
  }

  async setRpcUrl(arg: string) {
    this.rpcUrl = arg;
    await this.strgSrv.set(STORAGE_SELECTED_NODE, arg);
    this.changeNodeSubject.next();
  }

  async loadRpcUrl() {
    const node = await this.strgSrv.get(STORAGE_SELECTED_NODE);
    this.rpcUrl = node;
  }

  getRpcUrl() {
    return this.rpcUrl;
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
