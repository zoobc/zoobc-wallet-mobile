import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import zoobc from 'zbc-sdk';
import { STORAGE_ACTIVE_NETWORK_IDX, NETWORK_LIST } from 'src/environments/variable.const';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  public nodeIndex = 0;
  constructor(
    private strgSrv: StorageService,
  ) { }
  public changeNodeSubject: Subject<any> = new Subject<any>();

  setInitialNetwork() {
    zoobc.Network.list(NETWORK_LIST);
    this.strgSrv.get(STORAGE_ACTIVE_NETWORK_IDX).then((val: any) => {
      if (!val || val === null) {
        this.setNetwork(0);
      } else {
        this.setNetwork(val);
      }
    });

  }

  async setNetwork(idx: number) {
    this.nodeIndex = idx;
    zoobc.Network.set(idx);
    await this.strgSrv.set(STORAGE_ACTIVE_NETWORK_IDX, idx);
  }

  broadcastSelectNetwork(network: any) {
    this.changeNodeSubject.next(network);
  }

  async getNetwork() {
    await this.strgSrv.get(STORAGE_ACTIVE_NETWORK_IDX).then((val: any) => {
      this.nodeIndex = val;
    });

    return this.nodeIndex;

  }
}
