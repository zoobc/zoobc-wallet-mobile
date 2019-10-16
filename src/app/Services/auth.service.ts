import { Injectable } from "@angular/core";

import { Storage } from "@ionic/storage";
import * as CryptoJS from "crypto-js";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private storage: Storage) {}

  private _isLoggedIn = false;

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }

  private pinSetting = {
    salt: "salt",
    keySize: 8,
    iterations: 10000
  };

  encriptPin(pin) {
    const encripted = CryptoJS.PBKDF2(pin, this.pinSetting.salt, {
      keySize: this.pinSetting.keySize,
      iterations: this.pinSetting.iterations
    }).toString();

    return encripted;
  }

  async signUp(data, pin) {
    const encryptedPin = this.encriptPin(pin);
    const encSeed = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      encryptedPin
    ).toString();
    this.storage.set("AUTH_DATA", encSeed);
  }

  setAuthToken() {
    const data = {
      isLogin: true
    };

    const token = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      environment.secretLogin
    ).toString();

    this.storage.set("AUTH_TOKEN", token);
  }

  async isAuthenticate() {
    const authToken = await this.storage.get("AUTH_TOKEN");

    if (!authToken) return false;

    const authTokenData = CryptoJS.AES.decrypt(
      authToken,
      environment.secretLogin
    ).toString(CryptoJS.enc.Utf8);

    if (!authTokenData) return false;

    const authTokenDataObj = JSON.parse(authTokenData);

    if (!authTokenDataObj.isLogin) return false;

    return true;
  }

  async hasAccount() {
    const authData = await this.storage.get("AUTH_DATA");
    if (!authData) return false;

    return true;
  }

  async getAuthData(pin): Promise<any> {
    const encryptedPin = this.encriptPin(pin);

    const promise = new Promise(async (resolve, reject) => {
      try {
        let _return = null;

        const authDataString = await this.storage.get("AUTH_DATA");

        const authData = CryptoJS.AES.decrypt(
          authDataString,
          encryptedPin
        ).toString(CryptoJS.enc.Utf8);

        _return = JSON.parse(authData);

        resolve(_return);
      } catch (err) {
        reject("not match");
      }
    });

    return promise;
  }

  login(pin): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.getAuthData(pin).then(
        data => {
          this._isLoggedIn = true;
          //await this.setAuthToken(); //if using storage
          resolve(data);
        },
        err => {
          reject(err);
        }
      );
    });

    return promise;
  }

  async logout() {
    this._isLoggedIn = false;
  }

  async clearAccount() {
    await this.storage.remove("ACCOUNTS");
    await this.storage.remove("ACTIVE_ACCOUNT");
    await this.storage.remove("AUTH_DATA");
  }
}
