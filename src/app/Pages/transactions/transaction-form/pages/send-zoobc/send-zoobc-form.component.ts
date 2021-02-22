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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Contact } from 'src/app/Interfaces/contact';
import { TrxstatusPage } from 'src/app/Pages/send-coin/modals/trxstatus/trxstatus.page';
import { AccountService } from 'src/app/Services/account.service';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { QrScannerService } from 'src/app/Services/qr-scanner.service';
import { TransactionService } from 'src/app/Services/transaction.service';
import { Account } from 'src/app/Interfaces/account';
import { TRANSACTION_MINIMUM_FEE } from 'src/environments/variable.const';
import {
  addressValidator,
  escrowFieldsValidator
} from 'src/Helpers/validators';
import { calculateMinimumFee, Subscription } from 'zbc-sdk';

@Component({
  selector: 'app-send-zoobc-form',
  templateUrl: './send-zoobc-form.component.html',
  styleUrls: ['./send-zoobc-form.component.scss']
})
export class SendZoobcFormComponent implements OnInit {
  withEscrow: boolean;
  allFees = this.transactionSrv.transactionFees(TRANSACTION_MINIMUM_FEE);

  private minimumFee = TRANSACTION_MINIMUM_FEE;
  private minimumTime = 1;
  alertConnectionTitle = '';
  alertConnectionMsg = '';
  networkSubscription = null;
  sendMoneySummarySubscription = null;
  behaviorEscrowChangesSubscription: Subscription;

  sendForm = new FormGroup({
    sender: new FormControl({}),
    recipient: new FormControl({}, [Validators.required, addressValidator]),
    amount: new FormControl(0, [
      Validators.required,
      Validators.min(0)
    ]),
    fee: new FormControl(this.allFees[0].fee, [
      Validators.required,
      Validators.min(this.minimumFee)
    ]),
    message: new FormControl('', []),
  });

  submitted = false;
  account: Account;
  minError = false;
  escrowInstruction = '';

  constructor(
    private router: Router,
    private qrScannerSrv: QrScannerService,
    public loadingController: LoadingController,
    private modalController: ModalController,
    public alertController: AlertController,
    public addressbookService: AddressBookService,
    private translateService: TranslateService,
    private transactionSrv: TransactionService,
    private network: Network,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private accountSrv: AccountService
  ) {
    // if network changed reload data

    if (this.transactionSrv.txEscrowSubject) {
      this.transactionSrv.txEscrowSubject.subscribe((value) => {
        // console.log('value: ', value);
        this.updateMinimumFee();
      });
    }


  }

  get sender() {
    return this.sendForm.get('sender');
  }

  get message() {
    return this.sendForm.get('message');
  }

  get recipient() {
    return this.sendForm.get('recipient');
  }

  get amount() {
    return this.sendForm.get('amount');
  }

  get fee() {
    return this.sendForm.get('fee');
  }

  get behaviorEscrow() {
    return this.sendForm.get('behaviorEscrow');
  }

  getRecipientFromScanner() {
    const str  = this.qrScannerSrv.getResult();

    if (str) {
      const json = str.split('||');

      if (json && json[0]) {
        const addres: Contact = {
          name: '-',
          address: json[0]
        };
        this.recipient.setValue(addres);
      }

      if (json && json[1]) {
        this.amount.setValue(json[1]);
      }
    }

  }

  setBehaviorEscrowChanges() {
    console.log(' .. escrow changed');
    this.behaviorEscrowChangesSubscription = this.behaviorEscrow.valueChanges.subscribe(
      escrowValues => {
        if (escrowValues.commission) {
          this.setAmountValidation();
        }
        if (escrowValues.timeout) {
          // this.updateMinimumFee();
          this.setFeeValidation();
          this.setAmountValidation();
        }
      }
    );
  }

  async ngOnInit() {
    this.account = await this.accountSrv.getCurrAccount();
    this.sender.setValue(this.account);
    this.getRecipientFromScanner();
  }

  showLoading() {
    this.loadingController
      .create({
        message: 'Loading ...',
        duration: 1000
      })
      .then(res => {
        res.present();
      });
  }

  doRefresh(event: any) {
    this.showLoading();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  updateMinimumFee() {
    console.log('---- update value ---');
    let msg = this.message.value;
    this.minimumTime = 1;
    if (this.behaviorEscrow && this.behaviorEscrow.value) {

      console.log('---- update behaviorEscrow ---: ', this.behaviorEscrow.value);
      // console.log('---- instruction ---: ', this.behaviorEscrow.value.instruction);

      const currentTime  = Math.floor(Date.now() / 1000);
      let timeDiff  = this.behaviorEscrow.value.timeout - currentTime;
      // console.log('---- timeout ---: ', this.behaviorEscrow.value.timeout);
      // console.log('---- current ---: ', currentTime);
      // console.log('---- timeDiff ---: ', timeDiff);
      // console.log('---- timeDiffMin ---: ', timeDiff / 60);
      // console.log('---- timeDiffHour ---: ', timeDiff / 3600);
      const pert24Hour = Math.round(timeDiff / (3600 * 24));

      // console.log('---- timeDiff24Hour ---: ', pert24Hour);

      if (timeDiff < 0) {
        timeDiff = 0;
      }
      this.minimumTime = 1 + pert24Hour;
      // console.log('---- minimumTime ---: ', this.minimumTime);
      msg += this.behaviorEscrow.value.instruction;
    }

    const fee  = calculateMinimumFee(msg.length, 1).toFixed(6);
    this.minimumFee  = Number(fee); // 1.01;

    this.fee.setValue(this.minimumFee);

    console.log('---- minimumFee: ', this.minimumFee);

  }


  setAmountValidation() {

    let commition =  0;
    if (this.behaviorEscrow && this.behaviorEscrow.value ) {
        commition = this.behaviorEscrow.value.commission;
    }

    this.amount.setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(
        this.sender.value.balance -
        (this.minimumFee > this.fee.value
          ? this.minimumFee
          : this.fee.value) - commition
      )
    ]);

    this.amount.updateValueAndValidity();
  }

  setFeeValidation() {
    this.fee.setValidators([
      Validators.required,
      Validators.min(this.minimumFee)
    ]);
    this.fee.updateValueAndValidity();
  }

  changeWithEscrow(value: boolean) {
    console.log(value);
    this.withEscrow = value;

    if (value) {
      this.sendForm.addControl(
        'behaviorEscrow',
        new FormControl({}, [escrowFieldsValidator])
      );

      this.minimumFee = calculateMinimumFee(this.behaviorEscrow.value.timeout, 1);
      this.setBehaviorEscrowChanges();
    } else {
      this.sendForm.removeControl('behaviorEscrow');
      this.minimumFee = TRANSACTION_MINIMUM_FEE;
      if (this.behaviorEscrowChangesSubscription) {
        this.behaviorEscrowChangesSubscription.unsubscribe();
      }
    }

    this.setFeeValidation();
    this.setAmountValidation();
  }

  async presentAlertMinFeeConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Transaction  fee  <strong>changed</strong>!!!\n please check it again!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            // return;
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.doSend();
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  async submit() {
    this.minError = false;
    this.submitted = true;
   // const msgLength = (this.message.value).length;
    // console.log('=== msgLength: ', msgLength);
    // const minFee = calculateMinimumFee(msgLength, 1);
    // this.minimumFee = minFee;


    if (this.fee.value < this.minimumFee) {
      this.minError = true;
      return;
    }

    if (this.fee.value > TRANSACTION_MINIMUM_FEE) {
      this.presentAlertMinFeeConfirm();
    } else {
      this.doSend();
    }

  }

  doSend() {
    if (this.sendForm.valid) {
      const state: any = {
        sender: this.sender.value,
        recipient: this.recipient.value,
        amount: this.amount.value,
        fee: this.fee.value,
        message: this.message.value,
        withEscrow: this.withEscrow
      };

      if (this.withEscrow) {
        state.behaviorEscrow = this.behaviorEscrow.value;
        console.log('== this.behaviorEscrow.value: ', this.behaviorEscrow.value);
      }

      this.transactionSrv.saveTrx(state);
      this.router.navigate(['transaction-form/send-zoobc/summary']);
    }
  }


  onBehaviorEscrowChange() {
    this.minimumFee = this.behaviorEscrow.value && this.behaviorEscrow.value.timeout ?
    calculateMinimumFee(this.behaviorEscrow.value.timeout, 1) : TRANSACTION_MINIMUM_FEE;

    this.setFeeValidation();
    this.setAmountValidation();
  }

  async showErrorMessage(error) {

    let errMsg = await error.message;
    console.log('==== error: ', errMsg);

    if (errMsg.includes('UserBalanceNotEnough')) {
      errMsg = 'Balance not enought!';
    } else {
      errMsg = 'Oops fail, please try again later!';
    }

    const modal = await this.modalController.create({
      component: TrxstatusPage,
      componentProps: {
        msg: errMsg,
        status: false
      }
    });

    modal.onDidDismiss().then(() => {
      this.router.navigate(['tabs/home']);
    });

    return await modal.present();
  }

  async showSuccessMessage() {
    const modal = await this.modalController.create({
      component: TrxstatusPage,
      componentProps: {
        msg: 'transaction succes',
        status: true
      }
    });

    modal.onDidDismiss().then(() => {
      this.navCtrl.pop();
      this.router.navigate(['tabs/home']);
    });

    return await modal.present();
  }

  async getMinimumFee(timeout: number) {
    const fee: number = calculateMinimumFee(timeout, 1);
    return fee;
  }


  ionViewWillEnter() {
    this.networkSubscription = this.network
      .onDisconnect()
      .subscribe(async () => {
        const alert = await this.alertCtrl.create({
          header: this.alertConnectionTitle,
          message: this.alertConnectionMsg,
          buttons: [
            {
              text: 'OK'
            }
          ],
          backdropDismiss: false
        });

        alert.present();
      });

    this.translateService.get('No Internet Access').subscribe((res: string) => {
      this.alertConnectionTitle = res;
    });

    this.translateService
      .get(
        'Oops, it seems that you don\'t have internet connection. Please check your internet connection'
      )
      .subscribe((res: string) => {
        this.alertConnectionMsg = res;
      });
  }

  ionViewDidLeave() {
    if (this.networkSubscription) {
      this.networkSubscription.unsubscribe();
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    if (this.sendMoneySummarySubscription) {
      this.sendMoneySummarySubscription.unsubscribe();
    }
  }
}