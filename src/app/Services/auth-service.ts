import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import {
  STORAGE_ENC_PASSPHRASE_SEED,
  SALT_PASSPHRASE
} from 'src/environments/variable.const';
import { AccountService } from './account.service';
import { StorageService } from './storage.service';
import zoobc, { ZooKeyring } from 'zbc-sdk';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  private isUserLoggenIn: boolean;
  public tempKey: string;
  keyring: ZooKeyring;
  restoring: boolean;
  tempAccounts = [];

  constructor(
    private router: Router,
    private strgSrv: StorageService,
    private accountService: AccountService) {
      this.isUserLoggenIn = false;
    }

  async canActivate(route: ActivatedRouteSnapshot) {
    const acc = await this.accountService.getCurrAccount();
    console.log('--- acc: ', acc);
    if (acc === null || acc === undefined) {
      this.router.navigate(['initial']);
      return false;
    }
    if (!this.isUserLoggenIn) {
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }

  isLoggedIn() {
    return this.isUserLoggenIn;
  }

  async login(pin: string) {
    this.tempKey = pin;

    const passEncryptSaved = await this.strgSrv.get(STORAGE_ENC_PASSPHRASE_SEED);
    const passphrase = zoobc.Wallet.decryptPassphrase(passEncryptSaved, pin);

    if (passphrase) {
      this.keyring = new ZooKeyring(passphrase, SALT_PASSPHRASE);
      this.accountService.keyring = this.keyring;
      this.isUserLoggenIn = true;
      return this.isUserLoggenIn;
    }
    this.isUserLoggenIn = false;
    return this.isUserLoggenIn;
  }

  async logout() {
    this.isUserLoggenIn = false;
    this.tempKey = null;
  }
}
