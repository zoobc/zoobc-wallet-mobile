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
  isNeedSign = false;
  signer: Account;
  participantsWithSignatures = [];
  detailMultisig: any;
  totalParticpants: number;
  totalPending = 0;

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
    });

    this.priceInUSD = this.currencyService.getPriceInUSD();
  }

  ngOnInit() {
    this.msigHash = this.msigService.getHash();
    console.log('this.msigHash: ', this.msigHash);
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


      console.log('== this.multisigPendingDetail:', res);


      this.multiSigDetail = res.pendingtransaction;
      console.log('== this.multiSigDetail:', this.multiSigDetail);

      // this.detailMultisig.emit(this.multiSigDetail);

      this.pendingSignatures = res.pendingsignaturesList;
      this.totalPending = this.pendingSignatures.length;
      console.log('= this.pendingSignatures:', this.pendingSignatures);

      this.participants = res.multisignatureinfo.addressesList;
      this.signers = this.participants.map(pc => pc.value);
      console.log('= this.participants:', this.participants);
      console.log('= this.signers:', this.signers);

      this.participants = this.participants.map(res2 => res2.value);
      console.log('= this.participants value:', this.participants);

      this.totalParticpants = this.participants.length;
      console.log('= this.participants value:', this.participants);

      if (this.totalPending > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.totalPending; i++) {
          this.participants = this.participants.filter(
            res3 => res3 !== this.pendingSignatures[i].accountaddress.value
          );
        }
        const signers = (await this.accountService
          .allAccount())
          .filter(res5 => this.participants.includes(res5.address.value));
        if (signers.length > 0) {
          // this.signerAcc = signers[0];
          this.enabledSign = true;
        } else {
          this.enabledSign = false;
        }
      } else {
        const signers = (await this.accountService
          .allAccount())
          .filter(res4 => this.participants.includes(res4.address.value));
        if (signers.length > 0) {
          // this.signerAcc = signers[0];
          this.enabledSign = true;
        } else {
          this.enabledSign = false;
        }
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

    console.log('=== fee: ', this.fFee.value);
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
