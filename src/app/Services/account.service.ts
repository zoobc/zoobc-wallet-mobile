import { Injectable } from '@angular/core';
import {
  STORAGE_ALL_ACCOUNTS,
  STORAGE_CURRENT_ACCOUNT,
  STORAGE_ENC_PASSPHRASE_SEED,
  SALT_PASSPHRASE} from 'src/environments/variable.const';
import { Subject } from 'rxjs';
import { StoragedevService } from './storagedev.service';
import { Account } from '../Interfaces/account';
import { sanitizeString } from 'src/Helpers/utils';
import zoobc, { MultiSigAddress, ZooKeyring, getZBCAdress, TransactionListParams, TransactionsResponse } from 'zoobc-sdk';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  account: Account;
  private forWhat: string;
  private plainPassphrase: string;
  private arrayPhrase = [];
  private plainPin: string;
  private keyring: ZooKeyring;
  private restoring = false;

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
    this.keyring = new ZooKeyring(this.plainPassphrase, SALT_PASSPHRASE);
    const account = this.createNewAccount('Account 1', 0);
    await this.addAccount(account);
    this.savePassphraseSeed(this.plainPassphrase, this.plainPin);
  }

  createNewAccount(arg: string, pathNumber: number) {
    const childSeed = this.keyring.calcDerivationPath(0);
    const address = getZBCAdress(childSeed.publicKey);
    const account: Account = {
      name: sanitizeString(arg),
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
    const account: Account = {
      name: sanitizeString(name),
      type: 'multisig',
      path: signByAccount.path,
      nodeIP: null,
      address: multiSignAddress,
      participants: multiParam.participants,
      nonce: multiParam.nonce,
      minSig: multiParam.minSigs,
      signByAddress: signByAccount.address
    };

    return account;
  }

  async restoreAccounts() {
    const isRestored: boolean =
      (await this.strgSrv.get('IS_RESTORED')) === 'true';
    if (!isRestored && !this.restoring) {
      this.restoring = true;
      const keyring = this.keyring;

      let accountPath = 0;
      let accountsTemp = [];
      let accounts = [];
      let counter = 0;

      while (counter < 20) {
        const childSeed = keyring.calcDerivationPath(accountPath);
        const publicKey = childSeed.publicKey;
        const address = getZBCAdress(publicKey);
        const account: Account = {
          name: 'Account '.concat((accountPath + 1).toString()),
          path: accountPath,
          nodeIP: null,
          address,
          type: 'normal'
        };
        const params: TransactionListParams = {
          address,
          transactionType: 1,
          pagination: {
            page: 1,
            limit: 1
          }
        };
        await zoobc.Transactions.getList(params).then(
          (res: TransactionsResponse) => {
            // tslint:disable-next-line:radix
            const totalTx = parseInt(res.total);
            accountsTemp.push(account);
            if (totalTx > 0) {
              accounts = accounts.concat(accountsTemp);
              accountsTemp = [];
              counter = 0;
            }
          }
        );
        accountPath++;
        counter++;
      }
      this.strgSrv.set(STORAGE_ALL_ACCOUNTS, accounts);
      this.strgSrv.set('IS_RESTORED', 'true');

      this.restoring = false;
    }
  }
}
