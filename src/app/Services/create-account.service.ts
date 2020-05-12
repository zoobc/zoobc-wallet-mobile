import { Injectable } from '@angular/core';
import { KeyringService } from './keyring.service';
import { getAddressFromPublicKey, sanitizeString } from 'src/Helpers/utils';
import { COIN_CODE, SALT_PASSPHRASE } from 'src/environments/variable.const';
import { makeShortAddress } from 'src/Helpers/converters';
import { AccountService } from './account.service';
import { Account } from '../Interfaces/account';

@Injectable({
  providedIn: 'root'
})
export class CreateAccountService {
  private plainPassphrase: string;
  private arrayPhrase = [];
  private plainPin: string;

  constructor(
    private keyringService: KeyringService,
    private accountService: AccountService
  ) { }

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
    this.accountService.saveMainAccount(account);
    this.accountService.savePassphraseSeed(this.plainPassphrase, this.plainPin);
    this.accountService.saveMasterSeed(masterSeed, this.plainPin);
  }

  createNewAccount(arg: string, pathNumber: number) {
    const childSeed = this.keyringService.calcForDerivationPathForCoin(COIN_CODE, pathNumber);
    const newAddress = getAddressFromPublicKey(childSeed.publicKey);
    const account: Account = {
      name: sanitizeString(arg),
      path: pathNumber,
      nodeIP: null,
      created: new Date(),
      address: newAddress,
      shortAddress: makeShortAddress(newAddress)
    };

    return account;
  }

}
