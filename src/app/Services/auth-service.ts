import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import {
  STORAGE_ENC_MASTER_SEED,
  COIN_CODE
} from 'src/environments/variable.const';
import * as CryptoJS from 'crypto-js';
import { KeyringService } from './keyring.service';
import { AccountService } from './account.service';

export interface AccountInf {
  path: number;
  name: string;
  nodeIP: string;
  address: string;
  shortAddress: string;
  created: Date;
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
    private accountService: AccountService) { }

  async canActivate(route: ActivatedRouteSnapshot) {

    const acc = this.accountService.getCurrAccount();
    console.log('=== canActivate current account:', acc);

    if (!acc) {
      this.router.navigate(['initial']);
      return false;
    }

    if (!this.isUserLoggenIn) {
      this.router.navigate(['login']);
      return false;
    }

    return true;
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

  async logout() {
    this.isUserLoggenIn = false;
  }
}
