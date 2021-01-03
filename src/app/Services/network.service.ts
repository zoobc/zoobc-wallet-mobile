import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import zoobc from 'zbc-sdk';
import { STORAGE_ACTIVE_NETWORK_IDX, NETWORK_LIST, STORAGE_ALL_NETWORKS } from 'src/environments/variable.const';
import { Subject } from 'rxjs';
import { ZbcNetwork } from '../Interfaces/zbc-network';
@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  public nodeIndex = 0;
  public allNetorks: ZbcNetwork[];
  constructor(
    private strgSrv: StorageService,
  ) { }
  public changeNodeSubject: Subject<any> = new Subject<any>();

  setInitialNetwork() {

    this.strgSrv.getObject(STORAGE_ALL_NETWORKS).then((val: ZbcNetwork[]) => {
      if (!val || val === null) {
        console.log('val1: ', val);
        this.allNetorks = NETWORK_LIST;
        this.saveAll(this.allNetorks);
        zoobc.Network.list(this.allNetorks);
      } else {
        console.log('val2: ', val);
        this.allNetorks = val;
        zoobc.Network.list(this.allNetorks);
      }
    });

    this.strgSrv.get(STORAGE_ACTIVE_NETWORK_IDX).then((val: any) => {
      if (!val || val === null) {
        this.setNetwork(0);
      } else {
        this.setNetwork(val);
      }
    });
  }

  async add(network: ZbcNetwork) {
    this.allNetorks.push(network);
    zoobc.Network.list(this.allNetorks);
    await this.saveAll(this.allNetorks);
  }

  getall() {
    return this.allNetorks;
  }

  async saveAll(all: ZbcNetwork[]) {
    await this.strgSrv.setObject(STORAGE_ALL_NETWORKS, all);
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
