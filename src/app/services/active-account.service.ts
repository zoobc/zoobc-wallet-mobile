import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ActiveAccountService {
  account: any = {
    accountName: '',
    address: '',
    created: ''
  };

  constructor() {}

  public accountSubject: Subject<any> = new Subject<any>();

  setActiveAccount(account) {
    this.account = account;

    this.accountSubject.next(this.account);
  }
}
