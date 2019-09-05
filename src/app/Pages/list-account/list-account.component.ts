import { Component, OnInit } from "@angular/core";
import { NavController, ModalController } from "@ionic/angular";
import { ModalCreateAccountComponent } from "./modal-create-account/modal-create-account.component";
import { AccountService } from "src/app/Services/account.service";
import { ActiveAccountService } from "../../Services/active-account.service";
import { Account } from "src/app/Interfaces/account";

@Component({
  selector: "app-list-account",
  templateUrl: "./list-account.component.html",
  styleUrls: ["./list-account.component.scss"]
})
export class ListAccountComponent implements OnInit {
  constructor(
    private navtrl: NavController,
    private modalController: ModalController,
    private accountSrv: AccountService,
    private activeAccountSrv: ActiveAccountService
  ) {}

  //items: Account[] = [];

  items: any[] = [];

  async ngOnInit() {
    this.items = await this.accountSrv.getAll();
  }

  itemClicked(index) {
    const account = this.items[index];

    this.accountSrv.setActiveAccount(account).then(() => {
      this.activeAccountSrv.setActiveAccount(account);
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
        const account = returnVal.data.account;

        this.items.push(account);
      }
    });

    return await modal.present();
  }
}
