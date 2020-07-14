import { Injectable } from '@angular/core';
import { StoragedevService } from './storagedev.service';
import zoobc from 'zoobc-sdk';
import { STORAGE_ACTIVE_NETWORK_IDX } from 'src/environments/variable.const';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  public nodeIndex = 0;
  constructor(
    private strgSrv: StoragedevService,
  ) { }
  public changeNodeSubject: Subject<any> = new Subject<any>();

  setInitialNetwork() {
    this.strgSrv.get(STORAGE_ACTIVE_NETWORK_IDX).then((val: any) => {
      console.log('=== Network val: ', val);
      if (!val) {
        this.setNetwork(0);
      } else {
        this.setNetwork(val);
      }
    });

  }

  async setNetwork(idx: number) {
    console.log('==== Network Index: ', idx);
    this.nodeIndex = idx;
    zoobc.Network.set(idx);
    this.changeNodeSubject.next();
    await this.strgSrv.set(STORAGE_ACTIVE_NETWORK_IDX, idx);
  }

  async getNetwork() {
    await this.strgSrv.get(STORAGE_ACTIVE_NETWORK_IDX).then((val: any) => {
      this.nodeIndex = val;
    });

    return this.nodeIndex;

  }
}
