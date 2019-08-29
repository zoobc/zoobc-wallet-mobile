import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-address-book-modal",
  templateUrl: "./address-book-modal.component.html",
  styleUrls: ["./address-book-modal.component.scss"]
})
export class AddressBookModalComponent implements OnInit {
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
