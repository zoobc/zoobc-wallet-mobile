import { Injectable } from '@angular/core';
import {
  STORAGE_ALL_ACCOUNTS,
  STORAGE_CURRENT_ACCOUNT,
  STORAGE_ENC_MASTER_SEED,
  STORAGE_ENC_PASSPHRASE_SEED,
  COIN_CODE,
  SALT_PASSPHRASE,
  STORAGE_ALL_MULTISIG_ACCOUNTS
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
    private accountService: AccountService,
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
    this.recipient = arg;
    this.recipientSubject.next(this.recipient);
  }

  getRecipient() {
    return this.recipient;
  }

  allAccount() {
    const allAccount = this.strgSrv.get(STORAGE_ALL_ACCOUNTS).then(allaccs => {
      return allaccs;
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

  // getAllMultiSigAccount(type?: 'normal' | 'multisig'): Account[] {
  //   this.strgSrv.get(STORAGE_ALL_MULTISIG_ACCOUNTS).then(accounts => {
  //     return accounts;
  //   });
  // }

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
      console.log('===  accunts is null ===');
      accounts = [];
    }


    const { path } = account;
    const isDuplicate = accounts.find(acc => {
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

  savePassphraseSeed(passphrase: string, pin: string) {
    const encPassphraseSeed = doEncrypt(passphrase, pin);
    this.strgSrv.set(STORAGE_ENC_PASSPHRASE_SEED, encPassphraseSeed);
  }

  getCurrAccount(): Promise<Account> {
    return this.strgSrv.get(STORAGE_CURRENT_ACCOUNT);
  }

  async updateNameByAddress(arg: string, account: Account) {
    const accounts = this.allAccount();
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
    await this.accountService.removeAllAccounts();
    const { seed } = this.keyringService.calcBip32RootKeyFromMnemonic(
      COIN_CODE,
      this.plainPassphrase,
      SALT_PASSPHRASE
    );
    const masterSeed = seed;
    const account = this.createNewAccount('Account 1', 0);
    this.accountService.addAccount(account);
    this.accountService.savePassphraseSeed(this.plainPassphrase, this.plainPin);
    this.accountService.saveMasterSeed(masterSeed, this.plainPin);
  }

  createNewAccount(arg: string, pathNumber: number) {
    const childSeed = this.keyringService.calcForDerivationPathForCoin(COIN_CODE, pathNumber);
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

  createNewMultisigAccount(name: string, multiParam: MultiSigAddress, signBy: string, pathNumber: number) {

    const multiSignAddress: string = zoobc.MultiSignature.createMultiSigAddress(multiParam);
    const account: Account = {
      name: sanitizeString(name),
      type: 'multisig',
      path: pathNumber,
      nodeIP: null,
      address: multiSignAddress,
      participants: multiParam.participants,
      nonce: multiParam.nonce,
      minSig: multiParam.minSigs,
      signByAddress: signBy,
      created: new Date(),
      shortAddress: makeShortAddress(multiSignAddress)
    };

    return account;
  }

}
