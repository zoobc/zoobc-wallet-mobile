import { Injectable } from '@angular/core';
import {
  STORAGE_ALL_ACCOUNTS,
  STORAGE_CURRENT_ACCOUNT,
  STORAGE_ENC_MASTER_SEED,
  STORAGE_ENC_PASSPHRASE_SEED,
  COIN_CODE,
  SALT_PASSPHRASE
} from 'src/environments/variable.const';
import { Subject } from 'rxjs';
import { doEncrypt, makeShortAddress } from 'src/Helpers/converters';
import { StoragedevService } from './storagedev.service';
import { Account } from '../Interfaces/account';
import { KeyringService } from './keyring.service';
import { getAddressFromPublicKey, sanitizeString } from 'src/Helpers/utils';
import zoobc, { MultiSigAddress } from 'zoobc-sdk';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  account: Account;
  private forWhat: string;
  private recipient: Account;

  private plainPassphrase: string;
  private arrayPhrase = [];
  private plainPin: string;

  constructor(
    private keyringService: KeyringService,
    private strgSrv: StoragedevService
  ) {}

  public accountSubject: Subject<Account> = new Subject<Account>();
  public recipientSubject: Subject<Account> = new Subject<Account>();

  setForWhat(arg: string) {
    this.forWhat = arg;
  }

  getForWhat() {
    return this.forWhat;
  }

  setRecipient(arg: Account) {
    this.recipient = arg;
    this.recipientSubject.next(this.recipient);
  }

  getRecipient() {
    return this.recipient;
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

  async getPath0Address() {
    const accounts = await this.allAccount();
    return accounts[0].address;
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
    await this.strgSrv.remove(STORAGE_ENC_MASTER_SEED);
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
    console.log('=== setActiveAccount account:', account);
    await this.strgSrv.set(STORAGE_CURRENT_ACCOUNT, account);
    console.log('===== savve storage Account');
    this.broadCastNewAccount(account);
  }

  broadCastNewAccount(account: Account) {
    this.accountSubject.next(account);
  }

  async addAccount(account: Account) {
    console.log('==== Account', account);
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

  saveMasterSeed(seedBase58: string, pin: string) {
    const encSeed = doEncrypt(seedBase58, pin);
    this.strgSrv.set(STORAGE_ENC_MASTER_SEED, encSeed);
  }

  savePassphraseSeed(passphrase: string, pin: string) {
    const encPassphraseSeed = doEncrypt(passphrase, pin);
    this.strgSrv.set(STORAGE_ENC_PASSPHRASE_SEED, encPassphraseSeed);
  }

  getCurrAccount(): Promise<Account> {
    return this.strgSrv.get(STORAGE_CURRENT_ACCOUNT);
  }

  async updateAccount(account: Account) {
    console.log('== acount will updated: ', account);
    const accounts = await this.allAccount();

    for (let i = 0; i < accounts.length; i++) {
      const acc = accounts[i];
      if (acc.address === account.address) {
        console.log('=== finded, ' + i + ':', acc);
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
    const { seed } = this.keyringService.calcBip32RootKeyFromMnemonic(
      COIN_CODE,
      this.plainPassphrase,
      SALT_PASSPHRASE
    );
    const masterSeed = seed;
    const account = this.createNewAccount('Account 1', 0);
    this.addAccount(account);
    this.savePassphraseSeed(this.plainPassphrase, this.plainPin);
    this.saveMasterSeed(masterSeed, this.plainPin);
  }

  createNewAccount(arg: string, pathNumber: number) {
    const childSeed = this.keyringService.calcForDerivationPathForCoin(
      COIN_CODE,
      pathNumber
    );
    const newAddress = getAddressFromPublicKey(childSeed.publicKey);
    const account: Account = {
      name: sanitizeString(arg),
      path: pathNumber,
      type: 'normal',
      nodeIP: null,
      created: new Date(),
      address: newAddress,
      shortAddress: makeShortAddress(newAddress)
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
      signByAddress: signByAccount.address,
      created: new Date(),
      shortAddress: makeShortAddress(multiSignAddress)
    };

    return account;
  }
}
