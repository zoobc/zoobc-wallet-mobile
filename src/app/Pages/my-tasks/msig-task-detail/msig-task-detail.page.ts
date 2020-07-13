import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/Services/util.service';
import { AccountService } from 'src/app/Services/account.service';
import { StoragedevService } from 'src/app/Services/storagedev.service';
import { STORAGE_ESCROW_WAITING_LIST } from 'src/environments/variable.const';
import zoobc, { MultisigPendingTxDetailResponse, MultisigPendingTxResponse, toGetPendingList } from 'zoobc-sdk';
import { EnterpinsendPage } from '../../send-coin/modals/enterpinsend/enterpinsend.page';
import { Account } from 'src/app/Interfaces/account';
import { base64ToHex } from 'src/Helpers/utils';

@Component({
  selector: 'app-msig-task-detail',
  templateUrl: './msig-task-detail.page.html',
  styleUrls: ['./msig-task-detail.page.scss'],
})
export class MsigTaskDetailPage implements OnInit {

  private waitingList = [];
  private account: Account;
  private msigHash: any;
  private action: number;
  public isLoading = false;
  multiSigDetail: any;
  isLoadingTx = false;
  pendingSignatures = [];
  participants = [];
  enabledSign = true;

  constructor(
    private modalCtrl: ModalController,
    private activeRoute: ActivatedRoute,
    private modalController: ModalController,
    private utilService: UtilService,
    private storageService: StoragedevService
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      console.log('=== task detail Params: ', params);
      this.msigHash = params.msigHash;
    });
    this.loadDetail();
  }


  loadDetail() {
    const hashHex = base64ToHex(this.msigHash);
    this.isLoading = true;
    console.log('=== hashHex: ', hashHex);
    zoobc.MultiSignature.getPendingByTxHash(hashHex).then((res: MultisigPendingTxDetailResponse) => {
      const list = [];
      list.push(res.pendingtransaction);
      const tx: MultisigPendingTxResponse = {
        count: 1,
        page: 1,
        pendingtransactionsList: list,
      };
      const txFilter = toGetPendingList(tx);
      this.multiSigDetail = txFilter.pendingtransactionsList[0];

      console.log('=== Detail: ', this.multiSigDetail);

      this.pendingSignatures = res.pendingsignaturesList;
      this.participants = res.multisignatureinfo.addressesList;
      const idx = this.pendingSignatures.findIndex(
        sign => sign.accountaddress === this.account.signByAddress
      );

      console.log('=== idx: ', idx);

      if (idx >= 0) {
        this.enabledSign = false;
      } else {
        this.enabledSign = true;
      }
    }).finally(() => {
      this.isLoading = false;
      }
    );
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

  }

  async executeReject(pin: string) {

  }

}
