import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StoragedevService {

  constructor(
    private storage: Storage) { }

  async set(key: string, value: any) {
    await this.storage.set(key, value);
  }

  async remove(key: string) {
    await this.storage.remove(key);
  }

  async get(key: string): Promise<any> {
    const returnVal = await this.storage.get(key).then((val) => {
      return val;
    });
    return returnVal;
  }
}
