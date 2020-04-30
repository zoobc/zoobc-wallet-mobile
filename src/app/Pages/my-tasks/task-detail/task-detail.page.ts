import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { STORAGE_ESCROW_WAITING_LIST } from 'src/environments/variable.const';
import zoobc from 'zoobc';
import { StoragedevService } from 'src/app/Services/storagedev.service';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Interfaces/Account';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
})
export class TaskDetailPage implements OnInit {

  waitingList = [];
  account: Account;
  escrowDetail: object;
  escrowId: any;

  constructor(
    private modalCtrl: ModalController,
    private accountService: AccountService,
    private storageService: StoragedevService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      console.log('=== task detail Params: ', params);
      this.escrowId = params.escrowId;
    });
    this.loadDetail();
  }

  async loadDetail() {
    this.account = await this.accountService.getCurrAccount();
    this.waitingList = JSON.parse(await this.storageService.get(STORAGE_ESCROW_WAITING_LIST)) || [];
    if (this.waitingList.length > 50) {
      const reset = [];
      this.storageService.set(STORAGE_ESCROW_WAITING_LIST, JSON.stringify(reset));
    }

    zoobc.Escrows.get(this.escrowId).then(res => {
      this.escrowDetail = res;
    });


  }
  closeModal() {
    this.modalCtrl.dismiss();
  }

  cancel() {
    // TODO make function for cancel
  }

  async confirm(id) {
    const checkWaitList = this.waitingList.includes(id);
    const childSeed = null;  // get sedd from passphrase this.authServ.seed;
    const approval = '';
    if (checkWaitList !== true) {

      const data = {
        approvalAddress: approval,
        fee: 1,
        approvalCode: 0,
        transactionId: id,
      };

      zoobc.Escrows.approval(data, childSeed)
        .then(
          async res => {
            const trxMessage = res;

            //  TODO showm succes confirmation dialog.
            // TODO save waiting list into local storage

            this.waitingList.push(id);
            this.storageService.set(
              STORAGE_ESCROW_WAITING_LIST,
              JSON.stringify(this.waitingList)
            );

          },
          async err => {
            console.log('err', err);
            const message = err;
            // TODO show error msg dialog;  
          }
        )
        .finally(() => {
          // close dialog 
        });
    } else {
      const message = 'Transaction have been processed';
      // TODO show info dialog
    }
  }

  async reject(id) {
    const checkWaitList = this.waitingList.includes(id);
    if (checkWaitList !== true) {
      const data = {
        approvalAddress: this.account.address,
        fee: 1,
        approvalCode: 1,
        transactionId: id,
      };

      const childSeed = null;  // TODO this.authServ.seed;
      zoobc.Escrows.approval(data, childSeed)
        .then(
          async res => {
            const msg = res;

            // TODO Show dialog info for rejected
            this.waitingList.push(id);

            this.storageService.set(
              STORAGE_ESCROW_WAITING_LIST,
              JSON.stringify(this.waitingList)
            );
          },
          async err => {
            // this.isLoadingTx = false;
            console.log('err', err);
            const msg = "An error occurred while processing your request";
            // TODO show error dialog box
          }
        )
        .finally(() => {
          // close dialog box
        });
    } else {
      let message = 'Transaction have been processed';
      // TODO show dialog box;

    }
  }

}
