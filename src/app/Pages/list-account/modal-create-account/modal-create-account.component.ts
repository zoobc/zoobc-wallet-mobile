import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
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
    private accountSrv: AccountService
  ) {}

  account: any;
  accountName: String;
  accounts = [];

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  async createAccount() {
    const passphrase = await this.storage.get("passphrase");
    const account = await this.accountSrv.generateAccount(passphrase);
    const dataAccount = await this.accountSrv.insert(this.accountName, account);

    this.modalCtrl.dismiss({
      account: dataAccount
    });
  }
}
