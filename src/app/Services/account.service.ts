import { Injectable } from '@angular/core';
import {
  STORAGE_ALL_ACCOUNTS,
  STORAGE_CURRENT_ACCOUNT,
  STORAGE_ENC_MASTER_SEED,
  STORAGE_ENC_PASSPHRASE_SEED,
  STORAGE_MAIN_ACCOUNT} from 'src/environments/variable.const';
import { Subject } from 'rxjs';
import { doEncrypt } from 'src/Helpers/converters';
import { StoragedevService } from './storagedev.service';
import { Account } from '../Interfaces/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  account: Account;
  private forWhat: string;
  private recipient: Account;


  constructor(
    private strgSrv: StoragedevService) { }

  public accountSubject: Subject<Account> = new Subject<Account>();
  public recipientSubject: Subject<Account> = new Subject<Account>();


  setForWhat(arg: string) {
    this.forWhat = arg;
  }

  getForWhat() {
    return this.forWhat;
  }

  setRecipient(arg: Account) {
    // console.log('====== set Recipeint:', arg);
    this.recipient = arg;
    this.recipientSubject.next(this.recipient);
  }

  getRecipient() {
    return this.recipient;
  }

  async getAllAccount(): Promise<Account[]> {
    const allAccount = await this.strgSrv.get(STORAGE_ALL_ACCOUNTS);
    return allAccount;
  }

  async removeAllAccounts() {
    await this.strgSrv.remove(STORAGE_CURRENT_ACCOUNT);
    await this.strgSrv.remove(STORAGE_ENC_MASTER_SEED);
    await this.strgSrv.remove(STORAGE_ENC_PASSPHRASE_SEED);
    await this.strgSrv.remove(STORAGE_ALL_ACCOUNTS);
  }

  async generateDerivationPath(): Promise<number> {
    const accounts: Account[] = await this.getAllAccount();
    if (accounts && accounts.length) {
      return accounts.length;
    }
    return 0;
  }

  async setActiveAccount(account: Account) {
    console.log('=== setActiveAccount account:', account);
    await this.strgSrv.set(STORAGE_CURRENT_ACCOUNT, account);
    console.log('===== savve storage Account');
    this.broadCastNewAccount(account);
  }

  broadCastNewAccount(account: Account) {
    this.accountSubject.next(this.account);
  }

  async addAccount(account: Account) {
    console.log('====++++ addAccount: ');
    console.log('==== Account', account);
    let accounts = await this.getAllAccount();

    if (accounts === null) {
      console.log('===  accunts is null ===');
      accounts = [];
    }


    const { path } = account;
    const isDuplicate =  accounts.find(acc => {
      if (path && acc.path === path) {
        return true;
      }
      return false;
    });


    if (!isDuplicate) {
      accounts.push(account);
      console.log('==== add all Accounts 4: ', accounts);
      console.log('===== savve storage all accounts');
      await this.strgSrv.set(STORAGE_ALL_ACCOUNTS, accounts);
      await this.setActiveAccount(account);
    }
  }

  saveMasterSeed(seedBase58: string, pin: string) {
    const encSeed = doEncrypt(seedBase58, pin);
    this.strgSrv.set(STORAGE_ENC_MASTER_SEED, encSeed);
  }

  saveMainAccount(account: Account){
    this.strgSrv.set(STORAGE_MAIN_ACCOUNT, JSON.stringify(account));
  }

  getMainAccount() {
    return this.strgSrv.get(STORAGE_MAIN_ACCOUNT);
  }

  savePassphraseSeed(passphrase: string, pin: string) {
    const encPassphraseSeed = doEncrypt(passphrase, pin);
    this.strgSrv.set(STORAGE_ENC_PASSPHRASE_SEED, encPassphraseSeed);
  }

  getCurrAccount(): Promise<Account> {
    return this.strgSrv.get(STORAGE_CURRENT_ACCOUNT);
  }

  async updateNameByAddress(arg: string, account: Account) {
    const accounts = this.getAllAccount();
    let acc2 = null;
    const isExists = (await accounts).find(acc => {
      if (acc.address === account.address) {
        acc2 = acc;
        acc.name = arg;
        account.name = arg;
        return true;
      }
      return false;
    });

    if (isExists) {
      this.strgSrv.set(STORAGE_ALL_ACCOUNTS, accounts);
      this.broadCastNewAccount(account);
    }
  }

}
