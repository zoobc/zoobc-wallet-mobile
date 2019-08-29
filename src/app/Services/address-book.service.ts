import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { AddressBook } from "../Interfaces/address-book";

@Injectable({
  providedIn: "root"
})
export class AddressBookService {
  constructor(private storage: Storage) {}

  async getAll() {
    const addresses = await this.storage.get("addresses");
    return addresses;
  }

  async insert(name: string, address: string) {
    const _addresses = await this.getAll();
    const addresses = _addresses ? _addresses : [];

    const addressObj = {
      name: name,
      address: address,
      created: new Date()
    };

    //await this.storage.set("addresses", [...addresses, addressObj]);

    addresses.push(addressObj);

    await this.storage.set("addresses", addresses);

    return addressObj;
  }
}
