import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import sha512 from "crypto-js/sha512";

@Injectable({
  providedIn: "root"
})
export class CreateAccountService {
  private _passphrase: string;
  private _pin: string;

  constructor(private storage: Storage) {}

  get passphrase(): string {
    return this._passphrase;
  }

  set passphrase(value: string) {
    this._passphrase = value;
  }

  get pin(): string {
    return this._pin;
  }

  set pin(value: string) {
    this._pin = value;
  }
}
