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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { EnterpinsendPage } from 'src/app/Pages/send-coin/modals/enterpinsend/enterpinsend.page';
import { AuthService } from 'src/app/Services/auth-service';
import { TransactionService } from 'src/app/Services/transaction.service';
import { UtilService } from 'src/app/Services/util.service';
import { getTranslation } from 'src/Helpers/utils';
import zoobc, { SendZBCInterface } from 'zbc-sdk';

@Component({
  selector: 'app-send-zoobc-summary',
  templateUrl: './send-zoobc-summary.component.html',
  styleUrls: ['./send-zoobc-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SendZoobcSummaryComponent implements OnInit {


  formTrx: any;
  total = 0;

  constructor(
    private transactionSrv: TransactionService,
    private translate: TranslateService,
    private authSrv: AuthService,
    private utilSrv: UtilService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.formTrx = this.transactionSrv.getTrx();

    this.total = Number(this.formTrx.amount) + Number(this.formTrx.fee);
  }

  submit() {
    this.inputPIN();
  }


  async inputPIN() {
    const pinmodal = await this.modalController.create({
      component: EnterpinsendPage,
      componentProps: {}
    });

    pinmodal.onDidDismiss().then(async returnedData => {
      if (returnedData && returnedData.data && returnedData.data !== 0) {
        this.transferZoobc();
      }
    });

    return await pinmodal.present();
  }

  async transferZoobc() {

    // show loading bar
    const loading = await this.loadingController.create({
      message: 'Please wait, submiting!',
      duration: 100000
    });

    await loading.present();


    const data: SendZBCInterface = {
      sender: this.formTrx.sender.address,
      recipient: { value: this.formTrx.recipient.address, type: 0 },
      amount: Number(this.formTrx.amount),
      fee: Number(this.formTrx.fee),
      message: this.formTrx.message
    };



    if (this.formTrx.withEscrow) {
      const escrow = this.formTrx.behaviorEscrow;
      data.approverAddress = { value: escrow.approver.address, type: 0 };
      data.commission = escrow.commission ? escrow.commission : 0;
      data.timeout = escrow.timeout;
      data.instruction = escrow.instruction ? (escrow.instruction) : '';
    }

    const childSeed = this.authSrv.keyring.calcDerivationPath(
      this.formTrx.sender.path
    );

    await zoobc.Transactions.SendZBC(data, childSeed)
      .then(
        async (msg) => {
          console.log('msg: ', msg);
          const message = getTranslation('your transaction is processing', this.translate);
          const subMessage = getTranslation('you send coins to', this.translate, {
            amount: this.formTrx.amount,
            recipient: this.formTrx.recipient.address,
          });
          this.utilSrv.showConfirmation(message, subMessage, true);
          this.transactionSrv.transferZooBcSubject.next(true);
          this.router.navigateByUrl('/tabs/home');
        },
        async err => {
          console.log(err);
          const message = 'Opps...';
          const subMessage = getTranslation(err.message, this.translate);
          this.utilSrv.showConfirmation(message, subMessage, false);
        }
      )
      .finally(() => {
        loading.dismiss();
      });
  }

}
