import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";

@Component({
  selector: "app-modal-confirmation",
  templateUrl: "./modal-confirmation.component.html",
  styleUrls: ["./modal-confirmation.component.scss"]
})
export class ModalConfirmationComponent implements OnInit {
  sender: string;
  recipient: string;
  amount =  {
    ZBC: 0,
    USD: 0
  };
  fee: number;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    this.sender = this.navParams.get("sender");
    this.recipient = this.navParams.get("recipient");
    this.amount = this.navParams.get("amount");
    this.fee = this.navParams.get("fee");
  }

  closeModal() {
    this.modalController.dismiss();
  }

  confirm() {
    this.modalController.dismiss({
      confirm: true
    });
  }
}
