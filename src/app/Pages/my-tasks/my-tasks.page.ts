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
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';

import zoobc, {
  EscrowListParams,
  OrderBy,
  Escrows,
  HostInfoResponse,
  MempoolListParams,
  TransactionType,
  EscrowStatus,
  MultisigPendingListParams,
  PendingTransactionStatus,
  ZBCTransactions,
} from 'zbc-sdk';

import { Router, NavigationExtras } from '@angular/router';
import { Currency } from 'src/app/Interfaces/currency';
import { MultisigService } from 'src/app/Services/multisig.service';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.page.html',
  styleUrls: ['./my-tasks.page.scss'],
})
export class MyTasksPage implements OnInit {
  segmentModel = 'escrow';
  account: Account;
  listTrxPendingEsc: any;
  page = 1;
  total = 0;
  blockHeight = 0;
  isLoadingBlockHeight = false;
  isLoading = false;
  isLoadingMultisig = false;
  pageMultiSig: number;
  totalMultiSig: number;
  multiSigPendingList: any;
  isErrorMultiSig = false;
  isLoadingDetail = false;
  showSignForm = false;
  multiSigDetail: any;
  currencyRate: Currency;
  kindFee: string;
  advancedMenu = false;
  enabledSign = true;
  pendingSignatures = [];
  participants = [];
  PerPage = 1000;
  totalPendingTrxEsc: number;
  isError: boolean;

  constructor(
    private router: Router,
    private msigService: MultisigService,
    private accountService: AccountService) { }

  ngOnInit() {
    this.loadTask();
  }

  reload(event: any) {
    this.loadTask();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  toNumber(arg: any) {
    return Number(arg);
  }

  segmentChanged() {
  }

  async loadTask() {
    this.account = await this.accountService.getCurrAccount();
    // if (this.account.type !== 'normal') {
    //   this.segmentModel = 'multisig';
    // }

    this.getPengingTrxEsc();
    this.getMultiSigPendingList();
    this.getBlockHeight();

  }

  async getPendingMultisigApproval() {
    const paramPool: MempoolListParams = {
      address: this.account.address,
    };
    const list = await zoobc.Mempool.getList(paramPool).then(res => {
      return res;
    });
    return list;
  }

  async checkVisibleMultisig(pendingList) {
    const list = [];
    const pendingApprovalList = await this.getPendingMultisigApproval();
    if (pendingApprovalList.total > 0) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < pendingList.length; i++) {
        const onPending = pendingApprovalList.transactions.includes(pendingList[i].transactionHash);
        if (!onPending) {
          list.push(pendingList[i]);
        }
      }
      return list;
    } else {
      return pendingList;
    }
  }

  getMultiSigPendingList() {
    if (!this.isLoadingMultisig) {
      this.isLoadingMultisig = true;

      const params: MultisigPendingListParams = {
        address: this.account.address,
          // statusList: [EscrowStatus.PENDING, EscrowStatus.REJECTED, EscrowStatus.APPROVED],
       // status: PendingTransactionStatus.PENDINGTRANSACTIONPENDING,
        pagination: {
          page: this.pageMultiSig,
          limit: this.PerPage,
        },
      };
      zoobc.MultiSignature.getPendingList(params)
        .then(async (tx: ZBCTransactions) => {
          this.totalMultiSig = tx.total;
          const pendingList = tx.transactions;
          this.multiSigPendingList = pendingList;
          console.log('=== multiSigPendingList: ', this.multiSigPendingList);
        })
        .catch(err => {
          this.isErrorMultiSig = true;
          console.log(err);
        })
        .finally(() => (this.isLoadingMultisig = false));
    }
  }


  async getPendingEscrowApproval() {
    const params: MempoolListParams = {
      address: this.account.address,
    };
    const list = await zoobc.Mempool.getList(params).then(res => {
      let id = res.transactions.filter(tx => {
        if (tx.transactionType === TransactionType.APPROVALESCROWTRANSACTION) {
          return tx;
        }
      });
      id = id.map(idx => {
        return idx.txBody.transactionid;
      });
      return {
        total: id.length,
        transactions: id,
      };
    });
    return list;
  }

  async checkVisibleEscrow(escrowsList) {
    const list = [];
    const pendingApprovalList = await this.getPendingEscrowApproval();
    if (pendingApprovalList.total > 0) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < escrowsList.length; i++) {
        const onPending = pendingApprovalList.transactions.includes(escrowsList[i].id);
        if (!onPending) {
          list.push(escrowsList[i]);
        }
      }
      return list;
    } else {
      return escrowsList;
    }
  }

  private getPengingTrxEsc() {
    this.isLoading = true;
    this.isError = false;

    const params: EscrowListParams = {
      approverAddress: this.account.address,
      statusList: [EscrowStatus.PENDING, EscrowStatus.REJECTED, EscrowStatus.APPROVED],
      pagination: {
        page: this.page,
        limit: this.PerPage,
        orderBy: OrderBy.DESC,
        orderField: 'timeout',
      },
      latest: true,
    };

    zoobc.Escrows.getList(params)
        .then(async (res: Escrows) => {
          this.totalPendingTrxEsc = res.total;
          const trxList = res.escrowList;

          // if (trxList.length > 0) {
          //   trxList = await this.checkVisibleEscrow(trxList);
          // }

          this.listTrxPendingEsc = trxList;
          console.log('== listTrxPendingEsc: ', this.listTrxPendingEsc);
        })
        .catch(err => {
          this.isError = true;
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
  }

  getStatusName(status: number): any {
    switch (status) {

      case 0:
        return 'Pending';

      case 1:
        return 'Approved';

      case 2:
        return 'Rejected';

      case 3:
        return 'Expired';

      default:
        return 'Unknown';
    }
  }

  getBlockHeight() {
    this.isLoadingBlockHeight = true;
    zoobc.Host.getInfo()
      .then((res: HostInfoResponse) => {
        res.chainstatusesList.filter(chain => {
          if (chain.chaintype === 0) { this.blockHeight = chain.height; }
        });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => (this.isLoadingBlockHeight = false));
  }

  openDetail(escrowId: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        escrowId
      }
    };
    this.router.navigate(['/task-detail'], navigationExtras);
  }

  openMultisigDetail(msigHash: any) {
    console.log(msigHash);
    this.msigService.setHash(msigHash);
    this.router.navigate(['/msig-task-detail']);
  }

  public goDashboard() {
    this.router.navigate(['/tabs/home']);
  }

}
