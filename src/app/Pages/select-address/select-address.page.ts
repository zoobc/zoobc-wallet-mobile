import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { AddressBookService } from "src/app/Services/address-book.service";
import { AddressBook } from "src/app/Interfaces/address-book";
import { SelectAddressService } from "src/app/Services/select-address.service";

@Component({
  selector: "app-select-address",
  templateUrl: "./select-address.page.html",
  styleUrls: ["./select-address.page.scss"]
})
export class SelectAddressPage implements OnInit {
  addresses: AddressBook[] = [];

  constructor(
    private navCtrl: NavController,
    private addressBookSrv: AddressBookService,
    private selectAddressSrv: SelectAddressService
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

  selectAddress(index) {
    const addressObj = this.addresses[index];

    this.selectAddressSrv.select(addressObj);

    this.navCtrl.pop();
  }
}
