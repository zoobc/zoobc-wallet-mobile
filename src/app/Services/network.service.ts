import { Injectable } from '@angular/core';
import { STORAGE_ACTIVE_NETWORK, NETWORK_LIST } from 'src/environments/variable.const';
import { StoragedevService } from './storagedev.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  public network = '';
  constructor(
    private strgSrv: StoragedevService,
  ) { }


  setInitialNetwork() {
    // check if have selected language
    this.strgSrv.get(STORAGE_ACTIVE_NETWORK).then((val: any) => {
      if (!val) {
        const defaultNetwork = NETWORK_LIST[0].host;
        // console.log('========== default network: ', defaultNetwork);
        this.setNetwork(defaultNetwork);
      }
    });

  }

  async setNetwork(arg: string) {
    this.network = arg;
    await this.strgSrv.set(STORAGE_ACTIVE_NETWORK, arg);
  }

  async getNetwork() {
    this.strgSrv.get(STORAGE_ACTIVE_NETWORK).then((val: any) => {
      this.network = val;
    });

    return this.network;

  }
}
