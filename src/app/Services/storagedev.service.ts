import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StoragedevService {

  constructor(private storage: Storage) { }

  async set(key: string, value: any) {
     await this.storage.set(key, value);
  }

  async remove(key: string) {
     await this.storage.remove(key);
  }

  get(key: string): Promise<any> {

    const returnVal =  this.storage.get(key).then((val) => {
      console.log(' storage service key: ', key);
      console.log('==== storage service val: ', val);
      return val;
    });
    return returnVal;
  }
}
