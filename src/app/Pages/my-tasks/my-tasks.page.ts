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
} from 'zbc-sdk';

import { Router, NavigationExtras } from '@angular/router';
import { dateAgo } from 'src/Helpers/utils';
import { Currency } from 'src/app/Interfaces/currency';

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
    this.getBlockHeight();
    // this.getMultiSigPendingList(true);
    // this.startTimer();
  }

  // getMultiSigPendingList(reload: boolean = false) {
  //   if (!this.isLoadingMultisig) {
  //     this.isLoadingMultisig = true;
  //     if (reload) {
  //       this.multiSigPendingList = null;
  //       this.pageMultiSig = 1;
  //     }
  //     const params: MultisigPendingListParams = {
  //       address: this.account.address,
  //       // status: PendingTransactionStatus.PENDINGTRANSACTIONPENDING,
  //       pagination: {
  //         page: this.pageMultiSig,
  //         limit: this.PerPage,
  //         orderBy: OrderBy.DESC
  //       },
  //     };
  //     zoobc.MultiSignature.getPendingList(params)
  //     .then(async (res: ZBCTransactions) => {
  //         const tx = toGetPendingList(res);
  //         this.totalMultiSig = tx.count;
  //         const pendingList = tx.pendingtransactionsList;
  //         if (reload) {
  //           this.multiSigPendingList = pendingList;
  //         } else {
  //           this.multiSigPendingList = this.multiSigPendingList.concat(pendingList);
  //         }
  //       })
  //       .catch(err => {
  //         this.isErrorMultiSig = true;
  //         console.log(err);
  //       })
  //       .finally(() => (this.isLoadingMultisig = false));
  //   }
  // }

  startTimer() {
    setInterval(() => {
      this.loadTask();
    }, 100000);
  }


  doDateAgo(pDate: any) {
    return dateAgo(pDate);
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

  openMultisigDetail(msigHash: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        msigHash
      }
    };
    this.router.navigate(['/msig-task-detail'], navigationExtras);
  }

  public goDashboard() {
    this.router.navigate(['/tabs/home']);
  }

}
