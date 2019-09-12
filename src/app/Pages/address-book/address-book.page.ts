import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { AddressBookService } from "src/app/Services/address-book.service";
import { AddressBook } from "src/app/Interfaces/address-book";

@Component({
  selector: "app-address-book",
  templateUrl: "./address-book.page.html",
  styleUrls: ["./address-book.page.scss"]
})
export class AddressBookPage implements OnInit {
  addresses: AddressBook[] = [];

  constructor(
    private navCtrl: NavController,
    private addressBookSrv: AddressBookService
  ) {}

  async ngOnInit() {
    this.addressBookSrv.onInsert().subscribe(addressObj => {
      this.addresses.push(addressObj);
    });

    const addresses = await this.addressBookSrv.getAll();

    if (addresses) {
      for (let i = 0; i < addresses.length; i++) {
        const { name, address, created } = addresses[i];
        this.addresses.push(<AddressBook>{
          name,
          address,
          created
        });
      }
    }
  }

  createNewAddress() {
    this.navCtrl.navigateForward("/address-book/add");
  }
}
