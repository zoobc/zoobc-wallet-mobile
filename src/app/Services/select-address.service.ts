import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { AddressBook } from "../Interfaces/address-book";

@Injectable({
  providedIn: "root"
})
export class SelectAddressService {
  private _selectListener = new Subject<AddressBook>();

  constructor() {}

  onSelect(): Observable<any> {
    return this._selectListener.asObservable();
  }

  select(addressObj: AddressBook) {
    this._selectListener.next(addressObj);
  }
}
