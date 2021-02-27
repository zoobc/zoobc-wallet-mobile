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
import { ModalController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TRANSACTION_MINIMUM_FEE, COIN_CODE } from 'src/environments/variable.const';
import zoobc, {
  MultiSigInterface, signTransactionHash, multisigPendingDetail, MultisigPostTransactionResponse
} from 'zbc-sdk';
import { EnterpinsendPage } from '../../send-coin/modals/enterpinsend/enterpinsend.page';
import { TransactionService } from 'src/app/Services/transaction.service';
import { Currency } from 'src/app/Interfaces/currency';
import { CurrencyService } from 'src/app/Services/currency.service';
import { AccountService } from 'src/app/Services/account.service';
import { AuthService } from 'src/app/Services/auth-service';
import { UtilService } from 'src/app/Services/util.service';
import { MultisigService } from 'src/app/Services/multisig.service';
import { getTranslation } from 'src/Helpers/utils';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Account } from 'src/app/Interfaces/account';

@Component({
  selector: 'app-msig-task-detail',
  templateUrl: './msig-task-detail.page.html',
  styleUrls: ['./msig-task-detail.page.scss'],
})
export class MsigTaskDetailPage implements OnInit {
  currentAccount: Account;
  minFee = TRANSACTION_MINIMUM_FEE;
  formSend: FormGroup;
  fFee = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);
  fSender = new FormControl('', Validators.required);
  fMessage = new FormControl('');


  currencyRate: Currency;
  private msigHash: any;
  public isLoading = false;
  priceInUSD: number;
  primaryCurr = COIN_CODE;
  secondaryCurr: string;
  customfeeTemp: number;
  optionFee: string;
  customfee: number;
  customfee2: number;
  multiSigDetail: any;
  isLoadingTx = false;
  pendingSignatures = [];
  participants = [];
  signers = [];
  enabledSign = true;
  feeSlow = TRANSACTION_MINIMUM_FEE;
  feeMedium = this.feeSlow * 2;
  feeFast = this.feeMedium * 2;
  isCustomFeeValid = true;
  typeFee: number;
  customFeeValues: number;
  allFees = this.trxService.transactionFees(TRANSACTION_MINIMUM_FEE);
  errorMsg: string;
  customeChecked: boolean;
  minimumFee = TRANSACTION_MINIMUM_FEE;
  isNeedSign = true;
  signer: Account;
  participantsWithSignatures = [];
  detailMultisig: any;
  totalParticpants: number;
  totalPending = 0;
  allAcc: any;

  constructor(
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private modalController: ModalController,
    private currencyService: CurrencyService,
    private router: Router,
    private utilSrv: UtilService,
    private accountService: AccountService,
    private authSrv: AuthService,
    private loadingController: LoadingController,
    private utilService: UtilService,
    private msigService: MultisigService,
    private trxService: TransactionService) {

    this.formSend = new FormGroup({
      sender: this.fSender,
      fee: this.fFee,
      message: this.fMessage
    });

    this.priceInUSD = this.currencyService.getPriceInUSD();
  }

  async ngOnInit() {
    this.allAcc = await this.accountService.allAccount();
    this.msigHash = this.msigService.getHash();
    this.loadFeeAndCurrency();
    this.loadDetail();
    this.fFee.setValue(0.01);
  }

  reload(event: any) {
    this.loadDetail();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  loadFeeAndCurrency() {
    this.optionFee = this.allFees[0].fee.toString();
    this.currencyRate = this.currencyService.getRate();
    this.secondaryCurr = this.currencyRate.name;
    this.customfeeTemp = this.allFees[0].fee;
    this.customfee = this.customfeeTemp;
    this.customfee2 = this.customfeeTemp * this.priceInUSD * this.currencyRate.value;
  }

  changeFee() {
    this.customeChecked = false;
    if (Number(this.optionFee) < 0) {
      this.customeChecked = true;
      this.customfeeTemp = this.allFees[0].fee;
      this.convertCustomeFee();
    }
  }

  openMsig(txHash) {

    this.isLoadingTx = true;
    zoobc.MultiSignature.getPendingByTxHash(txHash).then(async (res: multisigPendingDetail) => {

      this.multiSigDetail = res.pendingtransaction;
      this.pendingSignatures = res.pendingsignaturesList;

      console.log('this.pendingSignatures: ', this.pendingSignatures);

      this.totalPending = this.pendingSignatures.length;

      this.participants = res.multisignatureinfo.addressesList;
      console.log('== this.participants1: ', this.participants);

      this.signers = this.participants.map(pc => pc.value);
      this.participants = this.participants.map(res2 => res2.value);

      this.totalParticpants = this.participants.length;

      if (this.totalPending > 0) {

        // if one or more already sign the transaction
        for (let i = 0; i < this.totalPending; i++) {
          this.participants = this.participants.filter(
            (res3) => res3 !== this.pendingSignatures[i].accountaddress.value
          );
        }
      }

      console.log('== this.participants: ', this.participants);
      console.log('== this.signers1: ', this.signers);

      // const signers = (await this.accountService
      //   .allAccount())
      //   .filter((res5: any) => this.participants.includes(res5.address.value));
      // if (signers.length > 0) {
      //   this.enabledSign = true;
      // } else {
      //   this.enabledSign = false;
      // }

      // no one sign the transaction

      for (let i = 0; i < this.totalPending; i++) {
        this.signers = this.signers.filter(
          (res3) => res3 !== this.pendingSignatures[i].accountaddress.value
        );
      }

      // this.signers = this.allAcc.filter(res4 => this.participants.includes(res4.address.value));

      const signers = this.allAcc
        .filter((res5: any) => this.signers.includes(res5.address.value));
      if (signers.length > 0) {
        this.enabledSign = true;
      } else {
        this.enabledSign = false;
      }

      this.isLoadingTx = false;
    });
  }

  async loadDetail() {
    this.participantsWithSignatures = [];
    this.openMsig(this.msigHash);
  }

  async copyAddress(address: string) {
    this.utilService.copyToClipboard(address);
  }


  validateCustomFee() {

    this.convertCustomeFee();
    if (this.minimumFee > this.customfee) {
      this.isCustomFeeValid = false;
      return;
    }

    if (this.customfee && this.customfee > 0) {
      this.isCustomFeeValid = true;
    } else {
      this.isCustomFeeValid = false;
    }
  }

  convertCustomeFee() {
    if (this.primaryCurr === COIN_CODE) {
      this.customfee = this.customfeeTemp;
      this.customfee2 = this.customfeeTemp * this.priceInUSD * this.currencyRate.value;
    } else {
      this.customfee = this.customfeeTemp / this.priceInUSD / this.currencyRate.value;
      this.customfee2 = this.customfee;
    }
  }

  async submit() {

    if (!this.fSender.value) {
      this.utilSrv.showAlert('Alert', '', 'Please select a sender first!');
      return;
    }

    if (this.fFee.value <= 0) {
      this.utilSrv.showAlert('Alert', '', 'Fee is required!');
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

    this.signer = this.fSender.value;
    console.log('== signer:', this.signer);
    this.showPin();
  }

  async showPin() {
    const pinmodal = await this.modalController.create({
      component: EnterpinsendPage
    });

    pinmodal.onDidDismiss().then((returnedData) => {
      if (returnedData && returnedData.data !== 0) {
        this.doAccept();
      }
    });
    return await pinmodal.present();
  }

  doIgnore() {
    this.goBack();
  }

  goBack() {
    this.router.navigate(['/my-tasks']);
  }

  async doAccept() {

    const loading = await this.loadingController.create({
      message: 'processing ..!',
      duration: 50000
    });
    loading.present();

    const seed = this.authSrv.keyring.calcDerivationPath(this.signer.path);
    const data: MultiSigInterface = {
      accountAddress: this.signer.address,
      fee: this.fFee.value,
      signaturesInfo: {
        txHash: this.multiSigDetail.transactionHash,
        participants: [
          {
            address: this.signer.address,
            signature: signTransactionHash(this.multiSigDetail.transactionHash, seed),
          },
        ],
      },
    };

    zoobc.MultiSignature.postTransaction(data, seed)
      .then((res: MultisigPostTransactionResponse) => {
        const message = getTranslation('transaction has been accepted', this.translate);
        Swal.fire({
          type: 'success',
          title: message,
          showConfirmButton: false,
          timer: 1500,
        });

        this.pendingSignatures = this.pendingSignatures.filter(
          tx => tx.transactionHash !== this.multiSigDetail.transactionHash
        );
      })
      .catch(err => {
        console.log(err.message);
        const message = getTranslation(err.message, this.translate);
        Swal.fire('Opps...', message, 'error');
      })
      .finally(() => {
        loading.dismiss();
        this.router.navigate(['/tabs/home']);
      });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
