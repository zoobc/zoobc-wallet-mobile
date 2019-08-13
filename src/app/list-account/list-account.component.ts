import { Component, OnInit } from "@angular/core";
import { NavController, ModalController } from "@ionic/angular";
import { ModalCreateAccountComponent } from "./modal-create-account/modal-create-account.component";
import { Storage } from "@ionic/storage";
import { AccountService } from "src/services/account.service";

@Component({
  selector: "app-list-account",
  templateUrl: "./list-account.component.html",
  styleUrls: ["./list-account.component.scss"]
})
export class ListAccountComponent implements OnInit {
  constructor(
    private navtrl: NavController,
    public modalController: ModalController,
    private storage: Storage,
    private accountService: AccountService
  ) {}

  accounts: any = [];
  accountsRaw = [];

  ngOnInit() {
    this.storage.get("accounts").then(data => {
      this.accountsRaw = data;
      this.accounts = data.map(acc => {
        const { accountName, created } = acc;
        return {
          accountName,
          address: this.accountService.getAccountAddress(acc),
          created
        };
      });
    });
  }

  accountClicked(index) {
    const account = this.storage
      .set("active_account", this.accounts[index])
      .then(() => {
        this.navtrl.pop();
      });
  }

  createNewAccount() {
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalCreateAccountComponent
    });

    modal.onDidDismiss().then((returnVal: any) => {
      if (returnVal.data.account) {
        this.accounts.push(returnVal.data.account);
      }
    });

    return await modal.present();
  }
}
