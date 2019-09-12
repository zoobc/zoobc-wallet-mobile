import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { AddressBook } from "../Interfaces/address-book";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AddressBookService {
  private _insertListener = new Subject<AddressBook>();

  constructor(private storage: Storage) {}

  async getAll() {
    const addresses = await this.storage.get("addresses");
    return addresses;
  }

  onInsert(): Observable<any> {
    return this._insertListener.asObservable();
  }

  async insert(name: string, address: string) {
    const _addresses = await this.getAll();
    const addresses = _addresses ? _addresses : [];

    const addressObj = {
      name: name,
      address: address,
      created: new Date()
    };

    addresses.push(addressObj);

    await this.storage.set("addresses", addresses);

    this._insertListener.next(addressObj);

    return addressObj;
  }
}
