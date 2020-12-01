import { Injectable } from '@angular/core';
import {
  STORAGE_ALL_ACCOUNTS,
  STORAGE_CURRENT_ACCOUNT,
  STORAGE_ENC_PASSPHRASE_SEED,
  SALT_PASSPHRASE
} from 'src/environments/variable.const';
import { Subject } from 'rxjs';
import { StoragedevService } from './storagedev.service';
import { Account } from '../Interfaces/account';
import { sanitizeString } from 'src/Helpers/utils';
import zoobc, { MultiSigAddress, ZooKeyring, getZBCAddress } from 'zoobc-sdk';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  account: Account;
  private forWhat: string;
  private plainPassphrase: string;
  private arrayPhrase = [];
  private plainPin: string;
  keyring: ZooKeyring;
  willRestoreAccounts: boolean;
  private totalAccountLoaded = 20;

  constructor(
    private strgSrv: StoragedevService) { }

  public accountSubject: Subject<Account> = new Subject<Account>();
  public recipientSubject: Subject<Account> = new Subject<Account>();
  public approverSubject: Subject<Account> = new Subject<Account>();
  public senderSubject: Subject<Account> = new Subject<Account>();

  setForWhat(arg: string) {
    this.forWhat = arg;
  }

  getForWhat() {
    return this.forWhat;
  }

  setRecipient(arg: Account) {
    this.recipientSubject.next(arg);
  }

  setApprover(arg: Account) {
    this.approverSubject.next(arg);
  }

  setSender(arg: Account) {
    this.senderSubject.next(arg);
  }

  async getAccount(address: string) {
    const accounts = await this.allAccount();
    let account = null;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < accounts.length; i++) {
      const acc = accounts[i];
      if (acc.address === address) {
        account = acc;
        break;
      }
    }
    return account;
  }

  async allAccount(type?: 'normal' | 'multisig') {
    const allAccount: Account[] = await this.strgSrv
      .get(STORAGE_ALL_ACCOUNTS)
      .then(accounts => {
        if (accounts==null) {
          return null;
        }
        if (type && type === 'multisig') {
          return accounts.filter(acc => acc.type === 'multisig');
        } else if (type && type === 'normal') {
          return accounts.filter(acc => acc.type !== 'multisig');
        } else {
          return accounts;
        }
      });
    return allAccount;
  }

  async removeAllAccounts() {
    await this.strgSrv.remove(STORAGE_CURRENT_ACCOUNT);
    await this.strgSrv.remove(STORAGE_ENC_PASSPHRASE_SEED);
    await this.strgSrv.remove(STORAGE_ALL_ACCOUNTS);
  }

  async generateDerivationPath(): Promise<number> {
    const accounts: Account[] = await this.allAccount();
    if (accounts && accounts.length) {
      return accounts.length;
    }
    return 0;
  }

  async setActiveAccount(account: Account) {
    await this.strgSrv.set(STORAGE_CURRENT_ACCOUNT, account);
    this.broadCastNewAccount(account);
  }

  broadCastNewAccount(account: Account) {
    this.accountSubject.next(account);
  }

  async addAccount(account: Account) {
    let accounts = await this.allAccount();

    if (accounts === null) {
      accounts = [];
    }

    const { address } = account;
    const isDuplicate = accounts.find(acc => {
      if (address && acc.address === address) {
        return true;
      }
      return false;
    });

    if (!isDuplicate) {
      accounts.push(account);
      this.strgSrv.set(STORAGE_ALL_ACCOUNTS, accounts);
      await this.setActiveAccount(account);
    }
  }

  savePassphraseSeed(passphrase: string, key: string) {
    const encPassphraseSeed = zoobc.Wallet.encryptPassphrase(passphrase, key);
    this.strgSrv.set(STORAGE_ENC_PASSPHRASE_SEED, encPassphraseSeed);
  }

  getCurrAccount(): Promise<Account> {
    return this.strgSrv.get(STORAGE_CURRENT_ACCOUNT);
  }

  async updateAccount(account: Account) {
    const accounts = await this.allAccount();

    for (let i = 0; i < accounts.length; i++) {
      const acc = accounts[i];
      if (acc.address === account.address) {
        accounts[i] = account;
        this.strgSrv.set(STORAGE_ALL_ACCOUNTS, accounts);
        this.broadCastNewAccount(account);
        break;
      }
    }
  }

  setPlainPassphrase(arg: string) {
    this.plainPassphrase = arg;
    this.keyring = new ZooKeyring(this.plainPassphrase, SALT_PASSPHRASE);
  }

  getPassphrase(): string {
    return this.plainPassphrase;
  }

  setArrayPassphrase(value: string[]) {
    this.arrayPhrase = value;
  }

  getArrayPassphrase(): string[] {
    return this.arrayPhrase;
  }

  setPlainPin(arg: string) {
    this.plainPin = arg;
  }

  getPlainPin() {
    return this.plainPin;
  }

  async createInitialAccount() {
    await this.removeAllAccounts();
    const account = this.createNewAccount('Account 1', 0);
    await this.addAccount(account);
    this.savePassphraseSeed(this.plainPassphrase, this.plainPin);
  }

  createNewAccount(arg: string, pathNumber: number) {
    const childSeed = this.keyring.calcDerivationPath(pathNumber);
    const address = getZBCAddress(childSeed.publicKey);
    const account: Account = {
      name: (arg),
      path: pathNumber,
      type: 'normal',
      nodeIP: null,
      address
    };
    return account;
  }

  createNewMultisigAccount(
    name: string,
    multiParam: MultiSigAddress,
    signByAccount: Account
  ) {
    const multiSignAddress: string = zoobc.MultiSignature.createMultiSigAddress(
      multiParam
    );

    let signByPath = null;
    let sgnByAddrss = null;
    if (signByAccount && signByAccount.path) {
      signByPath = signByAccount.path;
      sgnByAddrss = signByAccount.address;
    }


    const account: Account = {
      name: (name),
      type: 'multisig',
      path: signByPath,
      nodeIP: null,
      address: multiSignAddress,
      participants: multiParam.participants,
      nonce: multiParam.nonce,
      minSig: multiParam.minSigs,
      signByAddress: sgnByAddrss
    };
    return account;
  }

  async restoreAccounts() {
    if (!this.willRestoreAccounts) {
        console.log('=== will return ');
        return;
    }
    /// add additional accounts begin
    const tempAccounts = [];

    for (let i = 1; i < this.totalAccountLoaded + 1; i++) {
      const account: Account = this.createNewAccount(
        `Account ${i + 1}`,
        i
      );
      tempAccounts.push(account.address);
    }

    try {
      const data = await zoobc.Account.getBalances(tempAccounts);
      const { accountbalancesList } = data;

      let exists = 0;
      for (let i = 0; i < tempAccounts.length; i++) {
        const account: Account = this.createNewAccount(
          `Account ${i + 1}`,
          i
        );

        await this.addAccount(account);


        if (
          accountbalancesList.findIndex(
            (acc: any) => acc.accountaddress === account.address
          ) >= 0
        ) {
          exists++;
        }

        if (exists >= accountbalancesList.length) {
          break;
        }
      }
    } catch (error) {
      console.log('__error', error);
    }
    this.willRestoreAccounts = false;
    /// add additional accounts end
  }

}
