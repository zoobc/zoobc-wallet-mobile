import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/Services/account.service';
import { AddressBookService } from 'src/app/Services/address-book.service';
import zoobc, { EscrowTransactionResponse, TransactionListParams, TransactionType } from 'zbc-sdk';

@Component({
  selector: 'app-escrow-history',
  templateUrl: './escrow-history.page.html',
  styleUrls: ['./escrow-history.page.scss'],
})
export class EscrowHistoryPage implements OnInit {

  escrowApprovalList: any[];
  address = '';
  page = 1;
  perPage = 10;
  total = 0;
  finished = false;
  isLoading = false;
  isError = false;
  escrowDetail: EscrowTransactionResponse;
  isLoadingDetail: boolean;
  lastRefresh: number;
  PerPage = 100;

  constructor(
    private accService: AccountService,
    private addresBookService: AddressBookService
  ) {}

  ngOnInit() {
    this.accService.getCurrAccount().then((acc) => {
      this.address = acc.address;
    });
    this.getApprovalList(true);
  }

  async getApprovalList(reload: boolean = false) {
    if (!this.isLoading) {

      if (reload) {
        this.escrowApprovalList = null;
        this.page = 1;
      }

      this.isLoading = true;
      this.isError = false;
      const param: TransactionListParams = {
        address: this.address,
        transactionType: TransactionType.APPROVALESCROWTRANSACTION,
        pagination: {
          page: this.page,
          limit: this.perPage,
        },
      };

      zoobc.Transactions.getList(param)
        .then(res => {
          this.total = parseInt(res.total, 10);
          const txMap = res.transactionsList.map(tx => {
            const approvalStatus = tx.approvalescrowtransactionbody.approval === 0 ? 'Approved' : 'Rejected';
            const alias = ''; // this.addresBookService.getNameByAddress(tx.senderaccountaddress) || '';
            return {
              id: tx.approvalescrowtransactionbody.transactionid,
              alias,
              sender: tx.senderaccountaddress,
              approvalStatus,
              timestamp: parseInt(tx.timestamp, 10) * 1000,
            };
          });
          this.escrowApprovalList = reload ? txMap : this.escrowApprovalList.concat(txMap);
        })
        .catch(err => {
          this.isError = true;
          console.log(err);
        })
        .finally(() => ((this.isLoading = false), (this.lastRefresh = Date.now())));
    }
  }

}
