import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { KeyringService } from "./keyring.service";
import sha512 from "crypto-js/sha512";
import CryptoJS from "crypto-js";

@Injectable({
  providedIn: "root"
})
export class CreateAccountService {
  private passphrase: string;
  private pin: string;

  keySize = 256;
  ivSize = 128;
  iterations = 100;

  message = "Hello World";
  password = "Secret Password";

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

  doEncrypt(msg, pass) {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);

    const key = CryptoJS.PBKDF2(pass, salt, {
        keySize: this.keySize / 32,
        iterations: this.iterations
      });

    const iv1 = CryptoJS.lib.WordArray.random(128/8);

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
