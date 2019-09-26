import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { AddressBook } from "../Interfaces/address-book";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AddressBookService {
  private _insertListener = new Subject<AddressBook>();
  private _updateListener = new Subject<any>();

  constructor(private storage: Storage) {}

  async getAll() {
    const addresses = await this.storage.get("addresses");
    return addresses;
  }

  onInsert(): Observable<any> {
    return this._insertListener.asObservable();
  }

  onUpdate(): Observable<any> {
    return this._updateListener.asObservable();
  }

  async save(name: string, address: string) {
    const _addresses = await this.getAll();
    const addresses = _addresses ? _addresses : [];

    const index = addresses.findIndex(elm => {
      return elm.address == address;
    });

    let addressObj: AddressBook;

    let isInsert = false;

    if (index >= 0) {
      //update
      addresses[index].name = name;
      addresses[index].address = address;

      addressObj = {
        name: addresses[index].name,
        address: addresses[index].address,
        created: addresses[index].created
      };
    } else {
      //insert
      addressObj = {
        name: name,
        address: address,
        created: new Date()
      };

      addresses.push(addressObj);

      isInsert = true;
    }

    await this.storage.set("addresses", addresses);

    if (isInsert) {
      this._insertListener.next(addressObj);
    } else {
      this._updateListener.next({ index, addressObj });
    }

    return addressObj;
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

  async delete(index) {
    const addresses = await this.storage.get("addresses");
    addresses.splice(index, 1);
    await this.storage.set("addresses", addresses);
  }

  async getAddressName(address: string) {
    const addresses = await this.getAll();

    if (addresses === null) return "";

    const index = addresses.findIndex((addr: AddressBook) => {
      return addr.address === address;
    });

    if (index >= 0) {
      return addresses[index].name;
    } else {
      return "";
    }
  }
}
