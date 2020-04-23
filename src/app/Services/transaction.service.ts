import { Injectable } from '@angular/core';
import { AddressBookService } from './address-book.service';
import { Subject } from 'rxjs';
import { STORAGE_SELECTED_NODE } from 'src/environments/variable.const';
import { StoragedevService } from './storagedev.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  srvClient: TransactionService;
  alladdress: any;
  private rpcUrl: string;

  public sendMoneySubject: Subject<any> = new Subject<any>();
  public changeNodeSubject: Subject<any> = new Subject<any>();

  constructor(private addressBookSrv: AddressBookService, private strgSrv: StoragedevService) {
    this.loadRpcUrl();
  }

  async setRpcUrl(arg: string) {
    this.rpcUrl = arg;
    await this.strgSrv.set(STORAGE_SELECTED_NODE, arg);
    this.changeNodeSubject.next();
  }

  async loadRpcUrl() {
    const node = await this.strgSrv.get(STORAGE_SELECTED_NODE);
    this.rpcUrl =  node;
  }

  getRpcUrl() {
    return this.rpcUrl;
  }


  getNameByAddress(address: string, alldress: any) {
    let name = '';
    if (alldress && alldress.__zone_symbol__value) {
      // console.log('=== Name: ', alldress.__zone_symbol__value);

      alldress.__zone_symbol__value.forEach((obj: { name: any; address: string; }) => {
        if (String(address).valueOf() === String(obj.address).valueOf()) {
          name = obj.name;
        }
      });
    }
    return name;
  }

  convertTransaction() { }

}
