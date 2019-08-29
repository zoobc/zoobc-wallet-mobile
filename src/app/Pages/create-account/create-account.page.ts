import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { KeyringService } from "../../Services/keyring.service";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-create-account",
  templateUrl: "./create-account.page.html",
  styleUrls: ["./create-account.page.scss"]
})
export class CreateAccountPage implements OnInit {
  account: any;
  accountName: String;

  constructor(
    private storage: Storage,
    private keyringService: KeyringService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.generateAccount();
  }

  async generateAccount() {
    const passphrase = await this.storage.get("passphrase");
    const accounts = await this.storage.get("accounts");
    const { bip32RootKey } = this.keyringService.calcBip32RootKeyFromSeed(
      "SPN",
      passphrase,
      null
    );

    this.account = this.keyringService.calcForDerivationPathForCoin(
      "SPN",
      accounts.length,
      0,
      bip32RootKey
    );
  }

  async createAccount() {
    const accounts = await this.storage.get("accounts");

    const account = {
      accountName: this.accountName,
      accountProps: this.account
    };

    console.log("__account", account);

    await this.storage.set("accounts", [...accounts, account]);

    this.navCtrl.pop();
  }
}
