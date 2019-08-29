import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { KeyringService } from "src/app/Services/keyring.service";
import { AccountService } from "src/app/Services/account.service";

@Component({
  selector: "app-modal-create-account",
  templateUrl: "./modal-create-account.component.html",
  styleUrls: ["./modal-create-account.component.scss"]
})
export class ModalCreateAccountComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private storage: Storage,
    private keyringService: KeyringService
  ) {}

  account: any;
  accountName: String;
  accounts = [];

  coinCode = "ZBC - Zoobc";

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  async generateAccount() {
    const passphrase = await this.storage.get("passphrase");
    const accounts = await this.storage.get("accounts");

    const { bip32RootKey } = this.keyringService.calcBip32RootKeyFromSeed(
      this.coinCode,
      passphrase,
      null
    );

    this.account = this.keyringService.calcForDerivationPathForCoin(
      this.coinCode,
      accounts.length,
      0,
      bip32RootKey
    );
  }

  async createAccount() {
    const accounts = await this.storage.get("accounts");

    await this.generateAccount();

    const account = {
      accountName: this.accountName,
      accountProps: this.account,
      created: new Date()
    };

    await this.storage.set("accounts", [...accounts, account]);

    this.modalCtrl.dismiss({
      account
    });
  }
}
