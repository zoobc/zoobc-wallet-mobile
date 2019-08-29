import { Component, OnInit } from "@angular/core";
import { AddressBookService } from "src/app/Services/address-book.service";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-address-book-form",
  templateUrl: "./address-book-form.component.html",
  styleUrls: ["./address-book-form.component.scss"]
})
export class AddressBookFormComponent implements OnInit {
  name: string;
  address: string;

  constructor(
    private addressBookSrv: AddressBookService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  async addAddress() {
    const addressObj = await this.addressBookSrv.insert(
      this.name,
      this.address
    );

    this.modalController.dismiss({
      addressObj
    });
  }
}
