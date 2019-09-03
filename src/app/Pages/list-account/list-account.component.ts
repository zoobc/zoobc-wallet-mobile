import { Component, OnInit } from "@angular/core";
import { NavController, ModalController } from "@ionic/angular";
import { ModalCreateAccountComponent } from "./modal-create-account/modal-create-account.component";
import { Storage } from "@ionic/storage";
import { AccountService } from "src/app/Services/account.service";
import { ActiveAccountService } from "../../Services/active-account.service";

@Component({
  selector: "app-list-account",
  templateUrl: "./list-account.component.html",
  styleUrls: ["./list-account.component.scss"]
})
export class ListAccountComponent implements OnInit {
  constructor(
    private navtrl: NavController,
    private modalController: ModalController,
    private storage: Storage,
    private accountSrv: AccountService,
    private activeAccountSrv: ActiveAccountService
  ) {}

  items: any = [];

  async ngOnInit() {
    const accounts = await this.accountSrv.getAll();
    this.items = await this.renderItems(accounts);
  }

  renderItems(arr) {
    const promises = arr.map(async obj => {
      const balanceObj: any = await this.accountSrv.getBalance(obj.address);
      const balance = balanceObj.accountbalance.balance;
      return {
        accountName: obj.accountName,
        address: obj.address,
        balance: balance,
        created: obj.created
      };
    });
    return Promise.all(promises);
  }

  itemClicked(index) {
    const activeAccount = this.items[index];

    this.storage.set("active_account", activeAccount).then(() => {
      this.activeAccountSrv.setActiveAccount(activeAccount);
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
