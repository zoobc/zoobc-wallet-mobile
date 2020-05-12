import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { STORAGE_ESCROW_WAITING_LIST } from 'src/environments/variable.const';
import zoobc from 'zoobc';
import { StoragedevService } from 'src/app/Services/storagedev.service';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Interfaces/account';
import { ActivatedRoute } from '@angular/router';
import { EnterpinsendPage } from '../../send-coin/modals/enterpinsend/enterpinsend.page';
import { UtilService } from 'src/app/Services/util.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
})
export class TaskDetailPage implements OnInit {

  private waitingList = [];
  private account: Account;
  public escrowDetail: any;
  private escrowId: any;
  private action: number;
  public isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private activeRoute: ActivatedRoute,
    private modalController: ModalController,
    private utilService: UtilService,
    private accountService: AccountService,
    private storageService: StoragedevService
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      console.log('=== task detail Params: ', params);
      this.escrowId = params.escrowId;
    });
    this.loadDetail();
  }

  async loadDetail() {
    this.isLoading = true;
    this.account = await this.accountService.getCurrAccount();
    this.waitingList = JSON.parse(await this.storageService.get(STORAGE_ESCROW_WAITING_LIST)) || [];
    if (this.waitingList.length > 50) {
      const reset = [];
      this.storageService.set(STORAGE_ESCROW_WAITING_LIST, JSON.stringify(reset));
    }

    await zoobc.Escrows.get(this.escrowId).then(res => {
      this.escrowDetail = res;
    }).finally(() =>
    this.isLoading = false);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    this.action = 0;
    this.showPin();
  }

  reject() {
    this.action = 1;
    this.showPin();
  }

  async showPin() {
    const pinmodal = await this.modalController.create({
      component: EnterpinsendPage
    });

    pinmodal.onDidDismiss().then((returnedData) => {
      console.log('=== returned after entr pin: ', returnedData);
      if (returnedData && returnedData.data !== 0) {
        const pin = returnedData.data;
        if (this.action === 0) {
          this.executeConfirm(pin);
        } else {
          this.executeReject(pin);
        }
      }
    });
    return await pinmodal.present();
  }

  async executeConfirm(pin: string) {
    const escrowId = this.escrowDetail.id;
    const checkWaitList = this.waitingList.includes(escrowId);
    const childSeed = await this.utilService.generateSeed(pin, this.account.path);
    const approval = this.account.address;
    if (checkWaitList !== true) {

      const data = {
        approvalAddress: approval,
        fee: 1,
        approvalCode: 0,
        transactionId: escrowId,
      };

      zoobc.Escrows.approval(data, childSeed)
        .then(
          async res => {
            console.log('======= res approval:', res);
            this.waitingList.push(escrowId);
            this.storageService.set(
              STORAGE_ESCROW_WAITING_LIST,
              JSON.stringify(this.waitingList)
            );
            this.utilService.showConfirmation('Success', 'Transaction has approved successfully!', true, '/my-tasks');
          },
          async err => {
            console.log('err', err);
            const message = 'An error occurred while processing your request';
            this.utilService.showConfirmation('Fail', message, false, '/my-tasks');
          }
        )
        .finally(() => {
          // close dialog
        });
    } else {
      const message = 'All tasks have been processed';
      this.utilService.showConfirmation('info', message, true, '/my-tasks');
    }
  }

  async executeReject(pin: string) {
    const escrowId = this.escrowDetail.id;
    const checkWaitList = this.waitingList.includes(escrowId);
    const childSeed = await this.utilService.generateSeed(pin, this.account.path);
    const approval = this.account.address;

    if (checkWaitList !== true) {
      const data = {
        approvalAddress: approval,
        fee: 1,
        approvalCode: 1,
        transactionId: escrowId,
      };

      zoobc.Escrows.approval(data, childSeed)
        .then(
          async res => {
            console.log('============ success: ', res);
            this.utilService.showConfirmation('Success', 'Transaction has rejected successfully', true, '/my-tasks');
            this.waitingList.push(escrowId);
            this.storageService.set(
              STORAGE_ESCROW_WAITING_LIST,
              JSON.stringify(this.waitingList)
            );
          },
          async err => {
            console.log('err', err);
            const msg = 'An error occurred while processing your request' + err;
            this.utilService.showConfirmation('Fail', msg, false, '/my-tasks');
          }
        )
        .finally(() => {
          // close dialog box
        });
    } else {
      const message = 'All tasks have been processed';
      this.utilService.showConfirmation('info', message, true, '/my-tasks');
    }
  }

}
