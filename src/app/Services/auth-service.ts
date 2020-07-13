import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import {
  STORAGE_ENC_MASTER_SEED,
  COIN_CODE,
  CONST_HEX
} from 'src/environments/variable.const';
import { auth } from 'firebase/app';
import * as CryptoJS from 'crypto-js';
import { KeyringService } from './keyring.service';
import { AccountService } from './account.service';
import { doDecrypt } from 'src/Helpers/converters';
import { StoragedevService } from './storagedev.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  private isUserLoggenIn: boolean;
  public tempKey: string;

  constructor(
    private router: Router,
    private strgSrv: StoragedevService,
    private keyringServ: KeyringService,
    private accountService: AccountService) {
      this.isUserLoggenIn = false;
    }

  async canActivate(route: ActivatedRouteSnapshot) {
    const acc = await this.accountService.getCurrAccount();
    console.log('====== acc one canActivate: ', acc);
    if (acc === null || acc === undefined) {
      this.router.navigate(['initial']);
      return false;
    }

    // console.log('=== this.isUserLoggenIn:', this.isUserLoggenIn);

    if (!this.isUserLoggenIn) {
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }

  isLoggedIn() {
    return this.isUserLoggenIn;
  }

  isPinValid(encSeed: string, key: string): boolean {
    let isPinValid = false;
    try {
      const seed = doDecrypt(encSeed, key).toString(CryptoJS.enc.Utf8);
      if (!seed) {
        throw new Error('pin is not match');
      }
      isPinValid = true;
    } catch (e) {
      isPinValid = false;
    }
    return isPinValid;
  }


  async login(key: string) {
    console.log('=== Keyu: ', key);
    this.tempKey = key;
    const encSeed = await this.strgSrv.get(STORAGE_ENC_MASTER_SEED);
    const isPinValid = this.isPinValid(encSeed, key);
    if (isPinValid) {
      const ej = doDecrypt(encSeed, key).toString(CryptoJS.enc.Utf8);
      const seed = Buffer.from(ej, CONST_HEX);
      this.keyringServ.calcBip32RootKeyFromSeed(COIN_CODE, seed);
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
            console.log('LOG Out');
            resolve();
          }).catch((error) => {
            reject();
          });
      }
    });
  }

  userDetails() {
    return auth().currentUser;
  }

}
