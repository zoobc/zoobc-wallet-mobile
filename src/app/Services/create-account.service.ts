import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import CryptoJS from 'crypto-js';
import { KeyringService } from './keyring.service';
import { getAddressFromPublicKey } from 'src/Helpers/utils';
import { AuthService, SavedAccount } from './auth-service';
import { COIN_CODE, SALT_PASSPHRASE } from 'src/environments/variable.const';
import { makeShortAddress } from 'src/Helpers/converters';


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
    private authService: AuthService
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

  async createAccount() {
    console.log('=== Plain Passpharase', this.plainPassphrase);
    console.log('=== Plain PIN', this.plainPin);

    const { seed } = this.keyringService.calcBip32RootKeyFromMnemonic(
      COIN_CODE,
      this.plainPassphrase,
      SALT_PASSPHRASE
    );
    const masterSeed = seed;
    const childSeed = this.keyringService.calcForDerivationPathForCoin(COIN_CODE, 0);

    const publicKey = childSeed.publicKey;
    const newAddress = getAddressFromPublicKey(publicKey);
    console.log('=== new Address: ', newAddress);
    const account: SavedAccount = {
      name: 'Account 1',
      path: 0,
      nodeIP: null,
      address: newAddress,
      shortAddress: makeShortAddress(newAddress)
    };

    this.authService.addAccount(account);
    this.authService.savePassphraseSeed(this.plainPassphrase, this.plainPin);
    this.authService.saveMasterSeed(masterSeed, this.plainPin);
  }
}
