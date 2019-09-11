import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { KeyringService } from "../core/keyring.service";
import sha512 from "crypto-js/sha512";

@Injectable({
  providedIn: "root"
})
export class CreateAccountService {
  private passphrase: string;
  private pin: string;

  account: any;
  coinCode = "ZBC - Zoobc";

  constructor(
    private storage: Storage,
    private keyringService: KeyringService
  ) {}

  setPassphrase(value: string) {
    this.passphrase = value;
  }

  async setPin(value: string) {
    this.pin = sha512(value).toString();
    await this.storage.set("pin", this.pin);
  }

  async createAccount() {
    await this.storage.set("passphrase", this.passphrase);
    await this.storage.set("pin", this.pin);

    const { bip32RootKey } = this.keyringService.calcBip32RootKeyFromSeed(
      this.coinCode,
      this.passphrase,
      null
    );

    this.account = this.keyringService.calcForDerivationPathForCoin(
      this.coinCode,
      0,
      0,
      bip32RootKey
    );

    const account = {
      accountName: "Account 1",
      accountProps: this.account,
      created: new Date()
    };

    await this.storage.set("accounts", [account]);
    await this.storage.set("active_account", account);
  }
}
