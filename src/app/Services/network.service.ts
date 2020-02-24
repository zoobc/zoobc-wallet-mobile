import { Injectable } from '@angular/core';
import { ACTIVE_NETWORK, NETWORK_LIST } from 'src/environments/variable.const';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  
  public network = '';
  constructor(
    private storage: Storage,
  ) { }


  setInitialNetwork() {
    // check if have selected language
    this.storage.get(ACTIVE_NETWORK).then((val: any) => {
      if (!val) {
        const defaultNetwork = NETWORK_LIST[0].domain;
        console.log("========== default network: ", defaultNetwork);
        this.setNetwork(defaultNetwork);
      }
    });
 
  }

  setNetwork(arg: string) {
    this.network = arg;
    this.storage.set(ACTIVE_NETWORK, arg);
  }

  async getNetwork() {
    this.storage.get(ACTIVE_NETWORK).then((val: any) => {
      this.network = val;
    });

    return this.network;

  }
}
