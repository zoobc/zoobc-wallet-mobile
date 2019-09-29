import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})

export class AddressBookService {
  private STORAGE_NAME = 'addresses';

  constructor(private storage: Storage) { }

  async getAll() {
    const addresses = await this.storage.get(this.STORAGE_NAME);
    return addresses;
  }

  async insert(name: string, address: string) {
    let allAddress = await this.getAll();
    if (!allAddress) {
      allAddress = [];
    }

    allAddress.push({
      name,
      address,
      created: new Date()
    });

    await this.storage.set(this.STORAGE_NAME, allAddress);
  }

  async update(addresses: any) {
    await this.storage.set(this.STORAGE_NAME, addresses);
  }

}
