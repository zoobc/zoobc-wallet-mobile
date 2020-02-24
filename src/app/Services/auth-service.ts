import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Storage } from '@ionic/storage';

import {
  STORAGE_ALL_ACCOUNTS,
  STORAGE_CURRENT_ACCOUNT,
  STORAGE_ENC_MASTER_SEED,
  STORAGE_ENC_PASSPHRASE_SEED,
  COIN_CODE
} from 'src/environments/variable.const';
import * as CryptoJS from 'crypto-js';
import { KeyringService } from './keyring.service';

export interface SavedAccount {
  path: number;
  name: string;
  nodeIP: string;
  address: string;
  shortAddress: string;
  balance?: number;
  lastTx?: number;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  private isUserLoggenIn = false;
  // private loggedIn = false;

  constructor(
    private router: Router,
    private keyringServie: KeyringService,
    private storage: Storage) { }

  async canActivate(route: ActivatedRouteSnapshot) {
    // const isPinSetup = await this.storage.get('pin');

    const acc = this.getCurrAccount();
    console.log('=== canActivate current account:', acc);

    if (!acc) {
      this.router.navigate(['initial']);
      return false;
    }

    if (!this.isUserLoggenIn) {
      this.router.navigate(['login']);
      return false;
    }

    // else if (!this.isUserLoggenIn) {
    //   this.router.navigate(['initial']);
    //   return false;
    // }

    return true;
  }

  getCurrAccount(): SavedAccount {
    return JSON.parse(localStorage.getItem(STORAGE_CURRENT_ACCOUNT));
  }

  generateDerivationPath(): number {
    const accounts: SavedAccount[] =
      JSON.parse(localStorage.getItem(STORAGE_ALL_ACCOUNTS)) || [];
    return accounts.length;
  }

  isPinValid(encSeed: string, key: string): boolean {
    let isPinValid = false;
    try {
      const seed = CryptoJS.AES.decrypt(encSeed, key).toString(
        CryptoJS.enc.Utf8
      );
      if (!seed) { throw new Error('not match'); }
      isPinValid = true;
    } catch (e) {
      isPinValid = false;
    }
    return isPinValid;
  }

  login(key: string): boolean {
    // give some delay so that the dom have time to render the spinner
    const encSeed = localStorage.getItem(STORAGE_ENC_MASTER_SEED);
    const isPinValid = this.isPinValid(encSeed, key);
    if (isPinValid) {
      const seed = Buffer.from(
        CryptoJS.AES.decrypt(encSeed, key).toString(CryptoJS.enc.Utf8),
        'hex'
      );
      this.keyringServie.calcBip32RootKeyFromSeed(COIN_CODE, seed);
      return (this.isUserLoggenIn = true);
    }
    return (this.isUserLoggenIn = false);
  }

  // async login_old(pin) {
  //   const encryptedPin = sha512(pin.toString()).toString();
  //   const storedPin = await this.storage.get('pin');

  //   if (encryptedPin === storedPin) {
  //     this.isUserLoggenIn = true;
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  getAllAccount(): SavedAccount[] {
    return JSON.parse(localStorage.getItem(STORAGE_ALL_ACCOUNTS)) || [];
  }

  switchAccount(account: SavedAccount) {
    localStorage.setItem(STORAGE_CURRENT_ACCOUNT, JSON.stringify(account));
  }

  addAccount(account: SavedAccount) {
    const accounts = this.getAllAccount();
    const { path } = account;
    const isDuplicate = accounts.find(acc => {
      if (path && acc.path === path) { return true; }
      return false;
    });

    if (!isDuplicate) {
      accounts.push(account);
      localStorage.setItem(STORAGE_ALL_ACCOUNTS, JSON.stringify(accounts));
      this.switchAccount(account);
    }
  }

  saveMasterSeed(seedBase58: string, key: string) {
    const encSeed = CryptoJS.AES.encrypt(seedBase58, key).toString();
    localStorage.setItem(STORAGE_ENC_MASTER_SEED, encSeed);
  }

  savePassphraseSeed(passphrase: string, key: string) {
    const encPassphraseSeed = CryptoJS.AES.encrypt(passphrase, key).toString();
    localStorage.setItem(STORAGE_ENC_PASSPHRASE_SEED, encPassphraseSeed);
  }

  async logout() {
    this.isUserLoggenIn = false;
  }
}
