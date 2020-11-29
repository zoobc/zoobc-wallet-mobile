import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';

import zoobc, {
  toGetPendingList,
  MultisigPendingTxResponse,
  MultisigPendingListParams,
  EscrowListParams,
} from 'zoobc-sdk';

import { EscrowStatus, GetEscrowTransactionsResponse } from 'zoobc-sdk/grpc/model/escrow_pb';
import { OrderBy } from 'zoobc-sdk/grpc/model/pagination_pb';
import { Router, NavigationExtras } from '@angular/router';
import { AddressBookService } from 'src/app/Services/address-book.service';
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
  escrowTransactions: any;
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

  constructor(
    private router: Router,
    private accountService: AccountService,
    private addresBookSrv: AddressBookService) { }

  ngOnInit() {
    this.loadTask();
  }

  reload(event: any) {
    this.loadTask();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  segmentChanged() {
  }

  async loadTask() {
    this.account = await this.accountService.getCurrAccount();
    // if (this.account.type !== 'normal') {
    //   this.segmentModel = 'multisig';
    // }
    this.getBlockHeight();
    this.getEscrowTransaction();
    this.getMultiSigPendingList(true);
    this.startTimer();
  }

  getMultiSigPendingList(reload: boolean = false) {
    if (!this.isLoadingMultisig) {
      this.isLoadingMultisig = true;
      if (reload) {
        this.multiSigPendingList = null;
        this.pageMultiSig = 1;
      }
      const params: MultisigPendingListParams = {
        address: this.account.address,
        // status: PendingTransactionStatus.PENDINGTRANSACTIONPENDING,
        pagination: {
          page: this.pageMultiSig,
          limit: this.PerPage,
          orderBy: OrderBy.DESC
        },
      };
      zoobc.MultiSignature.getPendingList(params)
        .then((res: MultisigPendingTxResponse) => {
          const tx = toGetPendingList(res);
          this.totalMultiSig = tx.count;
          const pendingList = tx.pendingtransactionsList;
          if (reload) {
            this.multiSigPendingList = pendingList;
          } else {
            this.multiSigPendingList = this.multiSigPendingList.concat(pendingList);
          }
        })
        .catch(err => {
          this.isErrorMultiSig = true;
          console.log(err);
        })
        .finally(() => (this.isLoadingMultisig = false));
    }
  }

  startTimer() {
    setInterval(() => {
      this.loadTask();
    }, 100000);
  }


  doDateAgo(pDate: any) {
    return dateAgo(pDate);
  }

  getEscrowTransaction() {
    this.isLoading = true;
    const params: EscrowListParams = {
      approverAddress: this.account.address,
      // statusList: [0],
      statusList: [EscrowStatus.PENDING],
      pagination: {
        page: this.page,
        limit: this.PerPage,
        orderBy: OrderBy.DESC,
        orderField: 'timeout',
      },
      latest: true
    };

    zoobc.Escrows.getList(params)
      .then((res: GetEscrowTransactionsResponse.AsObject) => {
        this.total = Number(res.total);

        const trxs = res.escrowsList.filter(tx => {
          if (tx.latest === true) { return tx; }
        });

        const txMap = trxs.map(tx => {
          const alias = this.addresBookSrv.getNameByAddress(tx.recipientaddress) || '';
          
          return {
            id: tx.id,
            alias,
            senderaddress: tx.senderaddress,
            recipientaddress: tx.recipientaddress,
            approveraddress: tx.approveraddress,
            amount: tx.amount,
            commission: tx.commission,
            timeout: Number(tx.timeout),
            status: tx.status,
            blockheight: tx.blockheight,
            latest: tx.latest,
            instruction: tx.instruction,
          };
        });
        this.escrowTransactions = txMap;
      })
      .catch(err => {
        console.log(err);
      }).finally( () => {
        this.isLoading = false;
      });
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
      .then(res => {
        this.blockHeight = res.chainstatusesList[1].height;
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
    this.router.navigate(['/dashboard']);
  }

}
