// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//             contact us at roberto.capodieci[at]blockchainzoo.com
//             and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

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
import { StorageService } from './storage.service';
import { Account, AccountType } from '../Interfaces/account';
import zoobc, { ZooKeyring, getZBCAddress, BIP32Interface, AccountBalance, MultiSigInfo, Address } from 'zbc-sdk';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  account: Account;
  tempAccount: Account;
  private forWhat: string;
  private plainPassphrase: string;
  private arrayPhrase = [];
  private plainPin: string;
  keyring: ZooKeyring;
  private seed: BIP32Interface;
  private tempSeed: BIP32Interface;
  willRestoreAccounts: boolean;
  private totalAccountLoaded = 20;
  public accountSubject: Subject<Account> = new Subject<Account>();
  public tempSubject: Subject<Account> = new Subject<Account>();
  public recipientSubject: Subject<Account> = new Subject<Account>();
  public approverSubject: Subject<Account> = new Subject<Account>();
  public senderSubject: Subject<Account> = new Subject<Account>();

  constructor(private strgSrv: StorageService) { }


  setForWhat(arg: string) {
    this.forWhat = arg;
  }

  setTemp(acc: Account) {
    this.tempAccount = acc;
    this.tempSubject.next(acc);
  }
  getForWhat() {
    return this.forWhat;
  }
  getTempSeed() {
    return this.tempSeed;
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
    // const account: Account = accounts.filter((acc: Account) => {
    //   return acc.address && acc.address.value === address;
    // });
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
    const accounts = await this.strgSrv.getObject(STORAGE_ALL_ACCOUNTS);
    console.log('=== accs:', accounts);
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
    return accounts;
  }

  async removeAllAccounts() {
    this.strgSrv.remove(STORAGE_CURRENT_ACCOUNT);
    this.strgSrv.remove(STORAGE_CURRENT_ACCOUNT_MULTISIG);
    this.strgSrv.remove(STORAGE_ENC_PASSPHRASE_SEED);
    this.strgSrv.remove(STORAGE_ALL_ACCOUNTS);
  }

  async generateDerivationPath(): Promise<number> {
    const accounts = await this.strgSrv.getObject(STORAGE_ALL_ACCOUNTS);
    if (accounts && accounts.length) {
      return accounts.length;
    }
    return 0;
  }

  getSeed() {
    return this.seed;
  }

  broadCastNewAccount(account: Account) {
    this.accountSubject.next(account);
  }

  async addAccount(account: Account, isSwitch: boolean = true) {
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
      if (isSwitch) {
        this.switchAccount(account);
      } else {
        this.updateTempSeed(account);
      }
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
      if (acc.address.value === account.address.value) {
        accounts[i] = account;
        this.strgSrv.setObject(STORAGE_ALL_ACCOUNTS, accounts);
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

  createNewAccount(accountName: string, pathNumber: number) {
    const childSeed = this.keyring.calcDerivationPath(pathNumber);
    const address: Address = { value: getZBCAddress(childSeed.publicKey), type: 0 };

    const account: Account = {
      name: (accountName),
      path: pathNumber,
      type: 'normal',
      nodeIP: null,
      address
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
  updateTempSeed(account: Account) {
    if (account.path != null) {
      this.tempSeed = this.keyring.calcDerivationPath(account.path);
    }
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
