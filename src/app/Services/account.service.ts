import { Injectable } from '@angular/core';
import {
  STORAGE_ALL_ACCOUNTS,
  STORAGE_CURRENT_ACCOUNT,
  STORAGE_ENC_PASSPHRASE_SEED,
  SALT_PASSPHRASE,
  ACC_TYPE_MULTISIG,
  STORAGE_CURRENT_ACCOUNT_MULTISIG
} from 'src/environments/variable.const';
import { Subject } from 'rxjs';
import { StoragedevService } from './storagedev.service';
import { Account, AccountType } from '../Interfaces/account';
import zoobc, { ZooKeyring, getZBCAddress, BIP32Interface, AccountBalance, MultiSigInfo } from 'zbc-sdk';

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
  private seed: BIP32Interface;
  willRestoreAccounts: boolean;
  private totalAccountLoaded = 20;
  public accountSubject: Subject<Account> = new Subject<Account>();
  public recipientSubject: Subject<Account> = new Subject<Account>();
  public approverSubject: Subject<Account> = new Subject<Account>();
  public senderSubject: Subject<Account> = new Subject<Account>();

  constructor(private strgSrv: StoragedevService) { }


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
      if (acc.address.value === address) {
        account = acc;
        break;
      }
    }
    return account;
  }


  async allAccount(type?: AccountType) {
    const allAccount: Account[] = await this.strgSrv
      .getObject(STORAGE_ALL_ACCOUNTS)
      .then(accounts => {
        if (accounts == null) {
          return null;
        }
        if (type === 'normal') {
          return accounts.filter(acc => acc.type === 'normal');
        } else if (type === 'multisig') {
          return accounts.filter(acc => acc.type === 'multisig');
        } else if (type === 'imported') {
          return accounts.filter(acc => acc.type === 'imported');
        } else if (type === 'one time login') {
          return [this.getCurrAccount()];
        }
      });
    return allAccount;
  }

  async removeAllAccounts() {
    this.strgSrv.remove(STORAGE_CURRENT_ACCOUNT);
    this.strgSrv.remove(STORAGE_CURRENT_ACCOUNT_MULTISIG);
    this.strgSrv.remove(STORAGE_ENC_PASSPHRASE_SEED);
    this.strgSrv.remove(STORAGE_ALL_ACCOUNTS);
  }

  async generateDerivationPath(): Promise<number> {
    const accounts: Account[] = await this.allAccount();
    if (accounts && accounts.length) {
      return accounts.length;
    }
    return 0;
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
      this.strgSrv.setObject(STORAGE_ALL_ACCOUNTS, accounts);
      this.switchAccount(account);
    }
  }

  savePassphraseSeed(passphrase: string, key: string) {
    const encPassphraseSeed = zoobc.Wallet.encryptPassphrase(passphrase, key);
    this.strgSrv.set(STORAGE_ENC_PASSPHRASE_SEED, encPassphraseSeed);
  }

  getCurrAccount(): Promise<Account> {
    return this.strgSrv.getObject(STORAGE_CURRENT_ACCOUNT);
  }

  async updateAccount(account: Account) {
    const accounts = await this.allAccount();

    for (let i = 0; i < accounts.length; i++) {
      const acc = accounts[i];
      if (acc.address === account.address) {
        accounts[i] = account;
        this.strgSrv.setObject(STORAGE_ALL_ACCOUNTS, accounts);
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
    console.log('this.plainPassphrase: ', this.plainPassphrase);
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
      address:  { value: address, type: 0 }
    };
    return account;
  }

  createNewMultisigAccount(
    name: string,
    multiParam: MultiSigInfo,
  ) {

    const multiSignAddress: string = zoobc.MultiSignature.createMultiSigAddress(
      multiParam
    );

    const account: Account = {
      name: (name),
      type: 'multisig',
      path: null,
      nodeIP: null,
      address: { value: multiSignAddress, type: 0 },
      participants: multiParam.participants,
      nonce: multiParam.nonce,
      minSig: multiParam.minSigs
    };
    return account;
  }

  async restoreAccounts() {
    if (!this.willRestoreAccounts) {
      console.log('=== will return ');
      return;
    }


    for (let i = 1; i < this.totalAccountLoaded + 1; i++) {
      this.createNewAccount(
        `Account ${i + 1}`,
        i
      );
    }

    this.willRestoreAccounts = false;
    /// add additional accounts end
  }

  switchAccount(account: Account) {

    if (account) {
      this.strgSrv.setObject(STORAGE_CURRENT_ACCOUNT, account);
      if (account.type === ACC_TYPE_MULTISIG) {
        this.strgSrv.setObject(STORAGE_CURRENT_ACCOUNT_MULTISIG, account);
      }

      if (account.path != null) {
        this.seed = this.keyring.calcDerivationPath(account.path);
      }
      this.broadCastNewAccount(account);
    }
  }


  async switchMultisigAccount() {
    const account = await this.strgSrv.getObject(STORAGE_CURRENT_ACCOUNT_MULTISIG);
    this.switchAccount(account);
  }


  async getAccountsWithBalance(type?: AccountType): Promise<Account[]> {
    return new Promise(async (resolve, reject) => {
      const accounts = await this.allAccount(type);
      const addresses = accounts.map(acc => acc.address);
      zoobc.Account.getBalances(addresses)
        .then((accountBalances: AccountBalance[]) => {
          accounts.map((acc, i) => {
            acc.balance = accountBalances[i].balance;
            return acc;
          });
          resolve(accounts);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

}
