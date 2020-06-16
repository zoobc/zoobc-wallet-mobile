import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StoragedevService {

  constructor(
    private storage: Storage) { }

  set(key: string, value: any) {
    this.storage.set(key, value);
  }

  remove(key: string) {
    this.storage.remove(key);
  }

  get(key: string): Promise<any> {
    const returnVal = this.storage.get(key).then((val) => {
      return val;
    });
    return returnVal;
  }
}
