import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import { KeyringService } from './keyring.service';
import { getAddressFromPublicKey } from 'src/Helpers/utils';
import { AccountInf } from './auth-service';
import { COIN_CODE, SALT_PASSPHRASE } from 'src/environments/variable.const';
import { makeShortAddress } from 'src/Helpers/converters';
import { AccountService } from './account.service';


@Injectable({
  providedIn: 'root'
})
export class CreateAccountService {
  private plainPassphrase: string;
  private arrayPhrase = [];
  private plainPin: string;

  keySize = 256;
  ivSize = 128;
  iterations = 100;
  account: any;

  constructor(
    private keyringService: KeyringService,
    private  accountService: AccountService
  ) {}

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

  async setPlainPin(arg: string) {
    this.plainPin = arg;
  }

  async getPlainPin() {
   return this.plainPin;
  }

  doEncrypt(msg, pass) {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);

    const key = CryptoJS.PBKDF2(pass, salt, {
        keySize: this.keySize / 32,
        iterations: this.iterations
      });

    const iv1 = CryptoJS.lib.WordArray.random(128 / 8);

    const encrypted = CryptoJS.AES.encrypt(msg, key, {
      iv: iv1,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    // salt, iv will be hex 32 in length
    // append them to the ciphertext for use  in decryption
    const transitmessage = salt.toString() + iv1.toString() + encrypted.toString();
    return transitmessage;
  }

  doDecrypt(transitmessage, pass) {
    const salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
    const iv2 = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32));
    const encrypted = transitmessage.substring(64);

    const key = CryptoJS.PBKDF2(pass, salt, {
        keySize: this.keySize / 32,
        iterations: this.iterations
      });

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv2,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    return decrypted;
  }

  async createInitialAccount() {
    console.log('=== Plain Passpharase', this.plainPassphrase);
    console.log('=== Plain PIN', this.plainPin);

    this.accountService.removeAllAccounts();
    
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
    console.log('===== Path Number: ', pathNumber);
    console.log('===== COIN_CODE: ', COIN_CODE);
    const childSeed = this.keyringService.calcForDerivationPathForCoin(COIN_CODE, pathNumber);
    const newAddress = getAddressFromPublicKey(childSeed.publicKey);
    console.log('=== new Address: ', newAddress);
    const account: AccountInf = {
      name: arg,
      path: pathNumber,
      nodeIP: null,
      created: new Date(),
      address: newAddress,
      shortAddress: makeShortAddress(newAddress)
    };
    return account;
  }

}
