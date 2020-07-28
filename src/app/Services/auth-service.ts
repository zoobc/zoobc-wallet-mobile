import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import {
  STORAGE_ENC_PASSPHRASE_SEED,
  SALT_PASSPHRASE
} from 'src/environments/variable.const';
import { auth } from 'firebase/app';
import { AccountService } from './account.service';
import { StoragedevService } from './storagedev.service';
import zoobc, { ZooKeyring } from 'zoobc-sdk';

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
    private strgSrv: StoragedevService,
    private accountService: AccountService) {
      this.isUserLoggenIn = false;
    }

  async canActivate(route: ActivatedRouteSnapshot) {
    const acc = await this.accountService.getCurrAccount();
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

  registerUser(value) {
    return new Promise<any>((resolve, reject) => {
      auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err));
    });
  }

  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      auth().signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err));
    });
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (auth().currentUser) {
        auth().signOut()
          .then(() => {
            resolve();
          }).catch(() => {
            reject();
          });
      }
    });
  }

  userDetails() {
    return auth().currentUser;
  }

  async getBalanceByAddress(address: string) {
    return await zoobc.Account.getBalance(address)
      .then(data => {
        return data.accountbalance;
      });
  }

}
