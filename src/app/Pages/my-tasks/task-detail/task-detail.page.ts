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

import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { STORAGE_ESCROW_WAITING_LIST } from 'src/environments/variable.const';
import zoobc, { AccountBalance, calculateMinimumFee, EscrowApproval, EscrowApprovalInterface, generateTransactionHash } from 'zbc-sdk';
import { StorageService } from 'src/app/Services/storage.service';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Interfaces/account';
import { ActivatedRoute } from '@angular/router';
import { EnterpinsendPage } from '../../send-coin/modals/enterpinsend/enterpinsend.page';
import { AuthService } from 'src/app/Services/auth-service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { getTranslation, unixTimeStampToDate } from 'src/Helpers/utils';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from 'src/app/Services/util.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
})
export class TaskDetailPage implements OnInit {

  @ViewChild('myForm') ngForm: NgForm;

  private waitingList = [];
  private account: Account;
  public escrowDetail: any;
  private escrowId: any;

  private action: number;
  public isLoading = false;
  escrowForm: FormGroup;
  showForm = false;
  isSubmitted: boolean;
  escrowTransactionsData: any;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private activeRoute: ActivatedRoute,
    private modalController: ModalController,
    private authSrv: AuthService,
    private translate: TranslateService,
    private accountService: AccountService,
    private storageService: StorageService,
    private utilService: UtilService,
    private formBuilder: FormBuilder
  ) {
  }

  get errorControl() {
    return this.escrowForm.controls;
  }

  convertDate(epoch: any) {
    return unixTimeStampToDate(epoch);
  }

  async ngOnInit() {
    this.escrowForm = this.formBuilder.group({
      feesZbc: [0.01, [Validators.required]],
      fApprover: ['', [Validators.required]],
      fMessage: ['']
    });

    this.activeRoute.queryParams.subscribe(params => {
      this.escrowId = params.escrowId;
    });

    await this.loadDetail();
    // console.log('this.account: ', this.account);
    if (this.account) {
      this.escrowForm.get('fApprover').setValue(this.account.address.value);
    }

  }

  async loadDetail() {
    this.utilService.MergeAccountAndContact();
    this.isLoading = true;
    this.account = await this.accountService.getCurrAccount();
    this.waitingList = (await this.storageService.getObject(STORAGE_ESCROW_WAITING_LIST)) || [];
    if (this.waitingList.length > 50) {
      const reset = [];
      this.storageService.setObject(STORAGE_ESCROW_WAITING_LIST, reset);
    }

    await zoobc.Escrows.get(this.escrowId).then(res => {
      this.escrowDetail = res;
    }).finally(() => {
      this.isLoading = false;
      // console.log('===  this.escrowDetail:', this.escrowDetail);
    });
  }

  toNumber(arg: any) {
    return Number(arg);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  getName(address: string) {
    return this.accountService.getAlias(address);
  }

  submitForm() {

    this.isSubmitted = true;
    if (!this.escrowForm.valid) {
      return false;
    } else {
      // console.log(this.escrowForm.value);

      this.showPin();
    }
  }

  confirm() {
    this.action = 0;
    this.ngForm.onSubmit(undefined);
  }

  reject() {
    // console.log('== will reject');
    this.action = 1;
    this.ngForm.onSubmit(undefined);
  }

  async showPin() {
    const pinmodal = await this.modalController.create({
      component: EnterpinsendPage
    });

    pinmodal.onDidDismiss().then((returnedData) => {
      if (returnedData && returnedData.data !== 0) {
        if (this.action === 0) {
          this.executeConfirm();
        } else {
          this.executeReject();
        }
      }
    });

    return await pinmodal.present();

  }

  calculateFee() {
    const val = this.escrowForm.get('fMessage').value;
    if (val && (val.length > 0)) {
      const minFee = calculateMinimumFee(val.length, 1);
      this.escrowForm.get('feesZbc').setValue(minFee.toFixed(4));
    } else {
      this.escrowForm.get('feesZbc').setValue(0.01);
    }
  }

  getTrxHash(id: any) {
    const bfr = Buffer.from(id);
    return generateTransactionHash(bfr);
  }

  async executeConfirm() {

    const fFee = this.escrowForm.get('feesZbc');
    const trxId = this.escrowDetail.id;
    const fMsg = this.escrowForm.get('fMessage');

    const bc: AccountBalance = await zoobc.Account.getBalance(this.account.address);
    const balance = bc.spendableBalance / 1e8;

    if (balance >= fFee.value) {
      this.isLoading = true;
      const data: EscrowApprovalInterface = {
        approvalAddress: this.account.address,
        fee: fFee.value,
        approvalCode: EscrowApproval.APPROVE,
        transactionId: trxId,
        message: fMsg.value
      };

      const childSeed = this.authSrv.keyring.calcDerivationPath(this.account.path);

      zoobc.Escrows.approval(data, childSeed)
        .then(
          () => {
            this.isLoading = false;
            const message = getTranslation('transaction has been approved', this.translate);
            Swal.fire({
              type: 'success',
              title: message,
              showConfirmButton: false,
              timer: 1500,
            });
            this.escrowTransactionsData = this.escrowTransactionsData.filter(
              tx => tx.id !== trxId
            );
          },
          err => {
            this.isLoading = false;
            console.log('err', err);
            const message = getTranslation(err.message, this.translate);
            Swal.fire('Opps...', message, 'error');
          }
        )
        .finally(() => {
          this.navCtrl.pop();
        });
    } else {
      const message = getTranslation('your balances are not enough for this transaction', this.translate);
      Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }

  }

  async executeReject() {
    const fFee = this.escrowForm.get('feesZbc');
    const fMsg = this.escrowForm.get('fMessage');
    const trxId = this.escrowDetail.id;
    const bc: AccountBalance = await zoobc.Account.getBalance(this.account.address);
    const balance = bc.spendableBalance / 1e8;

    if (balance >= fFee.value) {
      this.isLoading = true;
      const data: EscrowApprovalInterface = {
        approvalAddress: this.account.address,
        fee: fFee.value,
        approvalCode: EscrowApproval.REJECT,
        transactionId: trxId,
        message: fMsg.value
      };

      const childSeed = this.authSrv.keyring.calcDerivationPath(this.account.path);

      zoobc.Escrows.approval(data, childSeed)
        .then(
          () => {
            this.isLoading = false;
            const message = getTranslation('transaction has been rejected', this.translate);
            Swal.fire({
              type: 'success',
              title: message,
              showConfirmButton: false,
              timer: 1500,
            });
            this.escrowTransactionsData = this.escrowTransactionsData.filter(
              tx => tx.id !== trxId
            );
          },
          err => {
            this.isLoading = false;
            console.log('err', err);
            const message = getTranslation(err.message, this.translate);
            Swal.fire('Opps...', message, 'error');
          }
        )
        .finally(() => {
          this.navCtrl.pop();
        });
    } else {
      const msg = getTranslation('your balances are not enough for this transaction', this.translate);
      Swal.fire({ type: 'error', title: 'Oops...', text: msg });
    }

  }

}
