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
import { Subject } from 'rxjs';
import { STORAGE_LIQUID_STOPED } from 'src/environments/variable.const';
import zoobc, { EscrowListParams, EscrowStatus, MultisigPendingListParams, OrderBy, ZBCTransaction, ZBCTransactions } from 'zbc-sdk';
import { StorageService } from './storage.service';

export interface LiquidSaved {
      txId: string;
      doneOn: number;
}

@Injectable({
  providedIn: 'root'
})


export class TransactionService {

  public msgNormal: string;
  public msgEscrow: string;
  public txTimeOut: number;

  public transferZooBcSubject: Subject<any> = new Subject<any>();
  public txEscrowSubject: Subject<any> = new Subject<any>();
  public transactionSuccessSubject: Subject<boolean> = new Subject<boolean>();
  frmSend: any;
  tempTrx: ZBCTransaction;
  constructor(private strgSrv: StorageService) {
  }

  transactionFees(minimumFee: number) {
    const fees = [{
      name: 'Regular',
      fee: minimumFee
    }];
    return fees;
  }

  async saveLiquidStoped(txId: any, doneOn: number) {
      const list = await this.strgSrv.getObject(STORAGE_LIQUID_STOPED);
      if (list && list.length > 0) {
        return;
      }
      const data: LiquidSaved = {txId, doneOn};
      this.strgSrv.setObject(STORAGE_LIQUID_STOPED, data);
  }


  async getLiquidStoped(txId: any) {
    const list = await this.strgSrv.getObject(STORAGE_LIQUID_STOPED);
    console.log('.... list: ', list);
    const lst = list.filter(txs => txs.txId === txId);
    console.log('.... lst: ', lst);
    return lst;
  }

  saveTrx(trx: any) {
    console.log('== trx service, saveTrx: ', trx);
    this.frmSend = trx;
  }

  getTrx() {
    return this.frmSend;
  }

  updateEscrowForm(arg: any) {
    this.txEscrowSubject.next(arg);
  }
  async getPendingTrxEscrow(address: any) {

    const params: EscrowListParams = {
      approverAddress: address,
      statusList: [EscrowStatus.PENDING],
      pagination: {
        page: 1,
        limit: 50,
        orderBy: OrderBy.DESC,
        orderField: 'timeout',
      },
      latest: true,
    };

    const mgParams: MultisigPendingListParams = {
      address,
      pagination: {
        page: 1,
        limit: 50,
      },
    };

    let total = 0;
    const trxs = await zoobc.Escrows.getList(params);
    if (trxs) {
      total = total + trxs.total;
    }

    const msTx = await zoobc.MultiSignature.getPendingList(mgParams);
    if (msTx) {
      total = total + msTx.total;
    }

    return total;

  }

}
