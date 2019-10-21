import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ActiveAccountService {
  account: any = {
    accountName: '',
    address: '',
    created: ''
  };

  private forWhat = '';
  private recipient = '';
  constructor() {}
  public accountSubject: Subject<any> = new Subject<any>();
  public recipientSubject: Subject<string> = new Subject<string>();

  setForWhat(arg: string){
    this.forWhat = arg;
  }

  getForWhat(){
    return this.forWhat;
  }

  setActiveAccount(account) {
    this.account = account;
    this.accountSubject.next(this.account);
  }

  setRecipient(arg: string) {
    console.log('====== set Recipeint:', arg);
    this.recipient = arg;
    this.recipientSubject.next(this.recipient);
  }

  getRecipient(){
    return this.recipient;
  }

}
