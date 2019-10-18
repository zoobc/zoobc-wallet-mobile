import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})

export class AddressBookService {
  private STORAGE_NAME = 'addresses';

  constructor(private storage: Storage) { }

  async getAll() {
    const addresses = await this.storage.get(this.STORAGE_NAME).catch(error => {
      console.log(error);
    });
    return addresses;
  }


  async getNameByAddress(address: string){
    const addresses = await this.getAll();
    let name = '';
    addresses.forEach( (obj: { name: any; address: string; }) => {
      if (String(address).valueOf() === String(obj.address).valueOf()) {
        name = obj.name;
      }
    });
    return name;
  }


  async updateByIndex(name: string, address: string, idx: number) {
    const allAddress = await this.getAll();
    allAddress[idx] = {
      name,
      address,
      created: new Date()
    };

    await this.update(allAddress);
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

    await this.update(allAddress);
  }

  async update(addresses: any) {
    await this.storage.set(this.STORAGE_NAME, addresses).catch(error => {
      console.log(error);
    });
  }

}
