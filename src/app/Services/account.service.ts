import { Injectable } from '@angular/core';
import {
  STORAGE_ALL_ACCOUNTS,
  STORAGE_CURRENT_ACCOUNT,
  STORAGE_ENC_MASTER_SEED,
  STORAGE_ENC_PASSPHRASE_SEED
} from 'src/environments/variable.const';
import { Subject } from 'rxjs';
import { doEncrypt } from 'src/Helpers/converters';
import { StoragedevService } from './storagedev.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ToastController } from '@ionic/angular';
import { Account } from '../Interfaces/Account';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  account: Account;
  private forWhat: string;
  private recipient: Account;

  constructor(
    private strgSrv: StoragedevService,
    private toastController: ToastController,
    private clipboard: Clipboard) { }

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

    console.log('== STORAGE_ALL_ACCOUNTS: ', await this.strgSrv.get(STORAGE_ALL_ACCOUNTS));
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

    console.log('====== accounts 2 : ', accounts);

    const isDuplicate =  accounts.find(acc => {
      if (path && acc.path === path) {
        return true;
      }
      return false;
    });

    console.log('====== isDuplicate: ', isDuplicate);

    console.log('====== accounts 3: ', accounts);
    const { path } = account;
    console.log('====== Path: ', path);

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

  savePassphraseSeed(passphrase: string, pin: string) {
    // console.log('===savePassphraseSeed: key', pin);
    // console.log('===savePassphraseSeed: passphrase', passphrase);
    const encPassphraseSeed = doEncrypt(passphrase, pin);
    // console.log('===savePassphraseSeed: encPassphraseSeed', encPassphraseSeed);
    this.strgSrv.set(STORAGE_ENC_PASSPHRASE_SEED, encPassphraseSeed);
  }

  getCurrAccount(): Promise<Account> {
    return this.strgSrv.get(STORAGE_CURRENT_ACCOUNT);
  }


  copyToClipboard(arg: any) {
    this.clipboard.copy(arg);
    this.clipboard.paste().then(
      (resolve: string) => {
        this.copySuccess();
       },
       (reject: string) => {
        this.copyInBrowser(arg);
        // alert('Error: ' + reject);
       }
     );
  }

  copyInBrowser(arg: any) {
    const val = arg;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.copySuccess();
  }

  async copySuccess() {
    const toast = await this.toastController.create({
      message: 'Copied to clipboard.',
      duration: 2000
    });

    toast.present();
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
