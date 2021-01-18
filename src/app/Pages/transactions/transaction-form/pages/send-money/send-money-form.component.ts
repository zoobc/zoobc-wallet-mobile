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
import { ActivatedRoute, Router } from '@angular/router';
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
import { UtilService } from 'src/app/Services/util.service';
import { TRANSACTION_MINIMUM_FEE } from 'src/environments/variable.const';
import { calculateMinFee } from 'src/Helpers/utils';
import {
  addressValidator,
  escrowFieldsValidator
} from 'src/Helpers/validators';
import { Subscription } from 'zbc-sdk';

@Component({
  selector: 'app-send-money-form',
  templateUrl: './send-money-form.component.html',
  styleUrls: ['./send-money-form.component.scss']
})
export class SendMoneyFormComponent implements OnInit {
  withEscrow: boolean;
  allFees = this.transactionSrv.transactionFees(TRANSACTION_MINIMUM_FEE);

  private minimumFee = TRANSACTION_MINIMUM_FEE;
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
      Validators.min(0.00000001)
    ]),
    fee: new FormControl(this.allFees[0].fee, [
      Validators.required,
      Validators.min(this.minimumFee)
    ])
  });

  submitted = false;
  account: import("/Volumes/Data/MOBILE_WALLET_PROJECTS/zoobc-wallet-mobile-after-merge/src/app/Interfaces/account").Account;

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
    private activeRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private accountSrv: AccountService
  ) { }

  get sender() {
    return this.sendForm.get('sender');
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
    this.behaviorEscrowChangesSubscription = this.behaviorEscrow.valueChanges.subscribe(
      escrowValues => {
        if (escrowValues.commission) {
          this.setAmountValidation();
        }

        if (escrowValues.timeout) {
          this.minimumFee = calculateMinFee(escrowValues.timeout.value);

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

  setAmountValidation() {
    this.amount.setValidators([
      Validators.required,
      Validators.min(0.00000001),
      Validators.max(
        this.sender.value.balance -
        (this.minimumFee > this.fee.value
          ? this.minimumFee
          : this.fee.value) -

        this.behaviorEscrow.value.commission
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
    this.withEscrow = value;

    if (value) {
      this.sendForm.addControl(
        'behaviorEscrow',
        new FormControl({}, [escrowFieldsValidator])
      );

      this.minimumFee = calculateMinFee(this.behaviorEscrow.value.timeout);
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



  async submit() {
    this.submitted = true;

    if (this.sendForm.valid) {
      const state: any = {
        sender: this.sender.value,
        recipient: this.recipient.value,
        amount: this.amount.value,
        fee: this.fee.value,
        withEscrow: this.withEscrow
      };

      if (this.withEscrow) {
        state.behaviorEscrow = this.behaviorEscrow.value;
      }

      this.transactionSrv.saveTrx(state);
      this.router.navigate(['transaction-form/send-money/summary']);
    }
  }


  onBehaviorEscrowChange() {
    this.minimumFee = this.behaviorEscrow.value && this.behaviorEscrow.value.timeout ?
      calculateMinFee(this.behaviorEscrow.value.timeout) : TRANSACTION_MINIMUM_FEE;

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
    const fee: number = calculateMinFee(timeout);
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
