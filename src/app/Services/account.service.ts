import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {
  STORAGE_ALL_ACCOUNTS,
  STORAGE_CURRENT_ACCOUNT,
  STORAGE_ENC_MASTER_SEED,
  STORAGE_ENC_PASSPHRASE_SEED
} from 'src/environments/variable.const';
import { AccountInf } from './auth-service';
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  account: AccountInf;
  private forWhat: string;
  private recipient: AccountInf;

  constructor(private storage: Storage) { }

  public accountSubject: Subject<AccountInf> = new Subject<AccountInf>();
  public recipientSubject: Subject<AccountInf> = new Subject<AccountInf>();


  setForWhat(arg: string) {
    this.forWhat = arg;
  }

  getForWhat() {
    return this.forWhat;
  }

  setRecipient(arg: AccountInf) {
    console.log('====== set Recipeint:', arg);
    this.recipient = arg;
    this.recipientSubject.next(this.recipient);
  }

  getRecipient() {
    return this.recipient;
  }

  getAllAccount(): AccountInf[] {
    return JSON.parse(localStorage.getItem(STORAGE_ALL_ACCOUNTS)) || [];
  }

  removeAllAccounts() {
    localStorage.removeItem(STORAGE_CURRENT_ACCOUNT);
    localStorage.removeItem(STORAGE_ENC_MASTER_SEED);
    localStorage.removeItem(STORAGE_ENC_PASSPHRASE_SEED);
    return localStorage.removeItem(STORAGE_ALL_ACCOUNTS);
  }

  generateDerivationPath(): number {
    const accounts: AccountInf[] =
      JSON.parse(localStorage.getItem(STORAGE_ALL_ACCOUNTS)) || [];
    if (accounts && accounts.length) {
      return accounts.length;
    }
    return 0;
  }

  setActiveAccount(account: AccountInf) {
    localStorage.setItem(STORAGE_CURRENT_ACCOUNT, JSON.stringify(account));
    this.broadCastNewAccount(account);
  }

  broadCastNewAccount(account: AccountInf) {
    this.accountSubject.next(this.account);
  }

  addAccount(account: AccountInf) {
    const accounts = this.getAllAccount();
    const { path } = account;
    const isDuplicate = accounts.find(acc => {
      if (path && acc.path === path) { return true; }
      return false;
    });

    if (!isDuplicate) {
      accounts.push(account);
      localStorage.setItem(STORAGE_ALL_ACCOUNTS, JSON.stringify(accounts));
      this.setActiveAccount(account);
    }
  }

  saveMasterSeed(seedBase58: string, key: string) {
    const encSeed = CryptoJS.AES.encrypt(seedBase58, key).toString();
    localStorage.setItem(STORAGE_ENC_MASTER_SEED, encSeed);
  }

  savePassphraseSeed(passphrase: string, key: string) {
    const encPassphraseSeed = CryptoJS.AES.encrypt(passphrase, key).toString();
    localStorage.setItem(STORAGE_ENC_PASSPHRASE_SEED, encPassphraseSeed);
  }

  getCurrAccount(): AccountInf {
    return JSON.parse(localStorage.getItem(STORAGE_CURRENT_ACCOUNT));
  }

  updateNameByAddress(arg: string, account: AccountInf) {
    const accounts = this.getAllAccount();
    let acc2 = null;
    const isExists = accounts.find(acc => {
      if (acc.address === account.address) { 
        acc2 = acc;
        acc.name = arg;
        account.name = arg;
        return true; 
      }
      return false;
    });

    if (isExists){
      localStorage.setItem(STORAGE_ALL_ACCOUNTS, JSON.stringify(accounts));
      this.broadCastNewAccount(account);
    }

  }


}
