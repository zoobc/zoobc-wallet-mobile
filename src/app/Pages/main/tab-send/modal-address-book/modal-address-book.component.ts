import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-modal-address-book",
  templateUrl: "./modal-address-book.component.html",
  styleUrls: ["./modal-address-book.component.scss"]
})
export class ModalAddressBookComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }

  selectAddress(address: string) {
    this.modalController.dismiss({
      address
    });
  }
}
