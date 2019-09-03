import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { AccountService } from "src/app/Services/account.service";

@Component({
  selector: "app-modal-list",
  templateUrl: "./modal-list-account.component.html",
  styleUrls: ["./modal-list-account.component.scss"]
})
export class ModalListAccountComponent implements OnInit {
  items: any = [];

  constructor(
    private modalController: ModalController,
    private accountSrv: AccountService
  ) {}

  async ngOnInit() {
    const accounts = await this.accountSrv.getAll();
    this.items = await this.renderItems(accounts);
  }

  renderItems(arr) {
    const promises = arr.map(async obj => {
      const balanceObj: any = await this.accountSrv.getBalance(obj.address);
      const balance = balanceObj.accountbalance.balance;
      return {
        name: obj.accountName,
        address: obj.address,
        balance: balance
      };
    });
    return Promise.all(promises);
  }

  selectItem(index: number) {
    const item = this.items[index];
    this.modalController.dismiss(item);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
