import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import * as CryptoJS from "crypto-js";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private _isLoggedIn = false;

  constructor(private storage: Storage) {}

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

  async login(pin): Promise<any> {
    const encryptedPin = this.encriptPin(pin);

    let _return = null;

    try {
      const authDataString = await this.storage.get("AUTH_DATA");

      const authData = CryptoJS.AES.decrypt(
        authDataString,
        encryptedPin
      ).toString(CryptoJS.enc.Utf8);

      if (!authData) throw "not match";

      //await this.setAuthToken(); //if using storage

      this._isLoggedIn = true;

      _return = JSON.parse(authData);
    } catch (e) {
      _return = "error";
    } finally {
      return _return;
    }
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
