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
    this.items = await this.accountSrv.getAll();
  }

  selectItem(index: number) {
    const item = this.items[index];

    this.modalController.dismiss(item);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
