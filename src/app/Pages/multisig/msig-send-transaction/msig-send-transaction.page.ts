
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
import { createInnerTxBytes, getTxType } from 'src/Helpers/multisig-utils';
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
    zoobc.MultiSignature.postTransaction(data, childSeed)
      .then(async () => {
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
