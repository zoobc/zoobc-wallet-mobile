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
import { TRANSACTION_MINIMUM_FEE } from 'src/environments/variable.const';
import { Account } from 'src/app/Interfaces/account';
import { MultisigService } from 'src/app/Services/multisig.service';
import { Router } from '@angular/router';
import zoobc, {
  isZBCAddressValid,
  MultiSigInterface
} from 'zbc-sdk';
import { AuthService } from 'src/app/Services/auth-service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { getTranslation } from 'src/Helpers/utils';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { createInnerTxBytes, getMultisigTitle, getTxType } from 'src/Helpers/multisig-utils';
import Swal from 'sweetalert2';
import { LoadingController } from '@ionic/angular';
import { UtilService } from 'src/app/Services/util.service';
@Component({
  selector: 'app-msig-send-transaction',
  templateUrl: './msig-send-transaction.page.html',
  styleUrls: ['./msig-send-transaction.page.scss'],
})
export class MsigSendTransactionPage implements OnInit {

  currentAccount: Account;
  minFee = TRANSACTION_MINIMUM_FEE;
  formSend: FormGroup;
  fFee = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);
  fSender = new FormControl('', Validators.required);
  draft: MultiSigDraft;
  isMultiSigAccount = false;
  participants = [];
  accountBalance: any;
  txType = '';
  innerTx: any[] = [];
  innerPage: number;
  accounts: Account[];
  title: string;

  constructor(
    public loadingController: LoadingController,
    private utilSrv: UtilService,
    private authSrv: AuthService,
    private translate: TranslateService,
    private router: Router,
    private multisigServ: MultisigService) {
    this.formSend = new FormGroup({
      sender: this.fSender,
      fee: this.fFee,
    });
  }

  async ngOnInit() {
    this.draft = this.multisigServ.draft;
    this.title = getMultisigTitle(this.draft.txType);
    this.fFee.setValue(this.minFee);
    const { fee } = this.draft;
    if (fee >= this.minFee) {
      this.fFee.setValue(fee);
      this.fFee.markAsTouched();
    }
    this.participants = this.draft.multisigInfo.participants.map(pc => pc.value);
  }

  updateTrxInfo() {
    this.txType = getTxType(this.draft.txType);
    this.innerTx = Object.keys(this.draft.txBody).map(key => {
      const item = this.draft.txBody;
      return {
        key,
        value: item[key],
        isAddress: isZBCAddressValid(item[key], 'ZBC'),
      };
    });
  }

  async submit() {
    if (!this.fSender.value) {
      this.utilSrv.showAlert('Alert', '', 'Please select a sender first!');
      return;
    }
    if (!this.formSend.valid) {
      return;
    }
    const address = this.fSender.value.address;
    const accBalance = await zoobc.Account.getBalance(address);
    const balance = Number(accBalance.spendableBalance / 1e8);
    if (balance < this.minFee) {
      const message = getTranslation('your balances are not enough for this transaction', this.translate);
      Swal.fire({ type: 'error', title: 'Oops...', text: message });
      return;
    }
    this.updateTrxInfo();
    this.send();
  }

  async send() {
    const loading = await this.loadingController.create({
      message: 'Please wait, submiting!',
      duration: 100000
    });
    await loading.present();

    const { multisigInfo, signaturesInfo } = this.draft;
    const unisgnedTransactions = (this.draft.unisgnedTransactions && Buffer.from(this.draft.unisgnedTransactions)) ||
      createInnerTxBytes(this.draft.txBody, this.draft.txType);
    const acc = this.fSender.value;
    const fees = this.fFee.value;
    const data: MultiSigInterface = {
      accountAddress: acc.address,
      fee: fees,
      multisigInfo,
      unisgnedTransactions,
      signaturesInfo,
    };

    const childSeed = this.authSrv.keyring.calcDerivationPath(acc.path);

    console.log('== data: ', data);

    zoobc.MultiSignature.postTransaction(data, childSeed)
      .then(async (msg) => {

        console.log('== msg:', msg);

        const message = getTranslation('your transaction is processing', this.translate);
        const subMessage = getTranslation('please tell the participant to approve it', this.translate);
        this.multisigServ.delete(this.draft.id);
        Swal.fire(message, subMessage, 'success');
        this.router.navigateByUrl('/tabs/home');
      })
      .catch(async err => {
        console.log(err.message);
        const message = getTranslation(err.message, this.translate);
        Swal.fire('Opps...', message, 'error');
      })
      .finally(() => {
        loading.dismiss();
      });
  }


  counter(i: number) {
    return new Array(i);
  }

  getClass(i: number) {
    if (i % 2 !== 0) { return true; }
    return false;
  }

  getItemByKey(i: number, j: number, key: string) {
    const index = i * 2 + j;
    const obj = this.innerTx[index];
    if (obj) { return obj[key]; }
    return '';
  }

  goHome() {
    this.router.navigate(['/tabs/home']);
  }

}
