// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//             contact us at roberto.capodieci[at]blockchainzoo.com
//             and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import zoobc, { GroupData } from 'zbc-sdk';
import { STORAGE_ACTIVE_NETWORK_GROUP, NETWORK_LIST, STORAGE_ALL_NETWORKS_GROUP } from 'src/environments/variable.const';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NetworkService {


  public allNetworks: GroupData[];
  public selectedGroup: GroupData[] = [];

  constructor(
    private strgSrv: StorageService,
  ) { }

  public changeNodeSubject: Subject<any> = new Subject<any>();

  setInitialNetwork() {

    this.strgSrv.getObject(STORAGE_ALL_NETWORKS_GROUP).then((networkList: GroupData[]) => {
      if (!networkList || networkList === null) {
        this.allNetworks = NETWORK_LIST;
        zoobc.Network.load([this.allNetworks[0]]);
        this.saveAll(NETWORK_LIST);
      } else {
        this.allNetworks = networkList;
        console.log('==  this.allNetworks: ', this.allNetworks);
      }
    });

    this.strgSrv.get(STORAGE_ACTIVE_NETWORK_GROUP).then((val: any) => {
      if (!val || val === null) {
        this.setActiveGroup(NETWORK_LIST[0]);
      } else {
        this.setActiveGroup(val);
      }
    });
  }

  async add(network: GroupData) {
    this.allNetworks.push(network);
    zoobc.Network.load(this.allNetworks);
    await this.saveAll(this.allNetworks);
  }

  async getAll() {
    return await this.strgSrv.getObject(STORAGE_ALL_NETWORKS_GROUP);
  }

  async saveAll(all: GroupData[]) {
    await this.strgSrv.setObject(STORAGE_ALL_NETWORKS_GROUP, all);
  }

  async setActiveGroup(obj: GroupData) {
    console.log('== setActiveGroup: ', obj);
    zoobc.Network.load([obj]);
    await this.strgSrv.set(STORAGE_ACTIVE_NETWORK_GROUP, obj);
  }

  broadcastSelectNetwork(network: any) {
    this.changeNodeSubject.next(network);
  }

  async getActiveGroup() {
    return await this.strgSrv.get(STORAGE_ACTIVE_NETWORK_GROUP);
  }

}
