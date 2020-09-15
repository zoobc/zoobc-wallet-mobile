import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { TRANSACTION_MINIMUM_FEE, COIN_CODE } from 'src/environments/variable.const';
import zoobc, {
  MultisigPendingTxDetailResponse,
  MultisigPendingTxResponse, toGetPendingList, MultiSigInterface, signTransactionHash
} from 'zoobc-sdk';
import { EnterpinsendPage } from '../../send-coin/modals/enterpinsend/enterpinsend.page';
import { Account } from 'src/app/Interfaces/account';
import { base64ToHex } from 'src/Helpers/utils';
import { TransactionService } from 'src/app/Services/transaction.service';
import { Currency } from 'src/app/Interfaces/currency';
import { CurrencyService } from 'src/app/Services/currency.service';
import { AccountService } from 'src/app/Services/account.service';
import { AuthService } from 'src/app/Services/auth-service';
import { UtilService } from 'src/app/Services/util.service';

@Component({
  selector: 'app-msig-task-detail',
  templateUrl: './msig-task-detail.page.html',
  styleUrls: ['./msig-task-detail.page.scss'],
})
export class MsigTaskDetailPage implements OnInit {

  currencyRate: Currency;
  private account: Account;
  private msigHash: any;
  public isLoading = false;
  priceInUSD: number;
  primaryCurr = COIN_CODE;
  secondaryCurr: string;
  customfeeTemp: number;
  optionFee: string;
  customfee: number;
  customfee2: number;
  transactionFee: number;
  multiSigDetail: any;
  isLoadingTx = false;
  pendingSignatures = [];
  participants = [];
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
  signer: any;
  signerAcc: any;
  participantsWithSignatures = [];

  constructor(
    private modalCtrl: ModalController,
    private activeRoute: ActivatedRoute,
    private modalController: ModalController,
    private currencyService: CurrencyService,
    private router: Router,
    private accountService: AccountService,
    private authSrv: AuthService,
    private loadingController: LoadingController,
    private utilService: UtilService,
    private trxService: TransactionService) {
    this.priceInUSD = this.currencyService.getPriceInUSD();
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.msigHash = params.msigHash;
    });

    this.loadFeeAndCurrency();
    this.loadDetail();

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

  async loadDetail() {
    this.participantsWithSignatures = [];
    this.account = await this.accountService.getCurrAccount();
    const hashHex = base64ToHex(this.msigHash);
    this.isLoading = true;
    await zoobc.MultiSignature.getPendingByTxHash(hashHex).then(async (res: MultisigPendingTxDetailResponse) => {
      const list = [];
      list.push(res.pendingtransaction);
      const tx: MultisigPendingTxResponse = {
        count: 1,
        page: 1,
        pendingtransactionsList: list,
      };

      const txFilter = toGetPendingList(tx);
      this.multiSigDetail = txFilter.pendingtransactionsList[0];
      this.pendingSignatures = res.pendingsignaturesList;
      this.participants = res.multisignatureinfo.addressesList;

      console.log('=== this participatns: ', this.participants);
      console.log('== this.pendingSignatures: ', this.pendingSignatures);

      this.enabledSign = false;
      for (let i = 0; i <= this.participants.length; i++) {
        const partAddress = this.participants[i];
        const partAcc = await this.accountService.getAccount(partAddress);
        if (partAcc) {
          // this.enabledSign = true;
          const idx = this.pendingSignatures.findIndex(
            sign => sign.accountaddress === partAddress
          );
          if (idx < 0) {
            console.log('== Signer-' + i + ': ', this.signer);
            this.signer = partAddress;
            this.signerAcc = partAcc;
            const sgSeed = this.authSrv.keyring.calcDerivationPath(partAcc.path);
            this.participantsWithSignatures.push({
              address: partAddress,
              signature: signTransactionHash(this.multiSigDetail.transactionhash, sgSeed)
            });
            this.enabledSign = true;
            // break;
          }

        }
      }

    }).finally(() => {
      this.isLoading = false;
    }
    );
    console.log('== participantsWithSignatures: ', this.participantsWithSignatures);
    console.log('== Signer Acc: ', this.signerAcc);
  }

  async copyAddress(address: string) {
    this.utilService.copyToClipboard(address);
  }

  closeModal() {
    this.modalCtrl.dismiss();
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

  confirm() {
    // TODO VALIDATE THIS
    this.transactionFee = Number(this.optionFee);
    if (this.customeChecked) {
      this.transactionFee = this.customfee;
    }

    if (!this.transactionFee) {
      this.transactionFee = this.allFees[0].fee;
    }
    // end

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

    // show loading bar
    const loading = await this.loadingController.create({
      message: 'processing ..!',
      duration: 50000
    });
    loading.present();

    this.isLoadingTx = true;
    const key = this.authSrv.tempKey;
    const participantsWithSignatures = [];

    for (let i = 0; i <= this.participants.length; i++) {
      const signer = this.participants[i];
      const signerAcc = await this.accountService.getAccount(signer);
      if (signerAcc) {
        const idx = this.pendingSignatures.findIndex(
          sign => sign.accountaddress === signer
        );
        if (idx < 0) {
          const sgSeed = this.authSrv.keyring.calcDerivationPath(signerAcc.path);
          participantsWithSignatures.push({
            address: signer,
            signature: signTransactionHash(this.multiSigDetail.transactionhash, sgSeed)
          });
        }
      }
    }

    const signerSeed = this.authSrv.keyring.calcDerivationPath(this.signerAcc.path);
    console.log('== participantsWithSignatures: ', participantsWithSignatures);
    console.log('== signer-2:', this.signer);
    console.log('== signerAcc-2:', this.signerAcc);
    console.log('== seed-2:', signerSeed);

    const data: MultiSigInterface = {
      accountAddress: this.signer,
      fee: this.transactionFee,
      signaturesInfo: {
        txHash: this.multiSigDetail.transactionhash,
        participants: participantsWithSignatures
      },
    };

    // const seedMsig = this.authSrv.keyring.calcDerivationPath(signerAcc.path);
    zoobc.MultiSignature.postTransaction(data, signerSeed)
      .then(() => {
        const message = 'Transaction has been accepted';
        this.utilService.showConfirmation('Succes', message, true, null);
      })
      .catch(err => {
        console.log(err);
        const message = err + 'An error occurred while processing your request';
        this.utilService.showConfirmation('Fail', message, false, null);
      })
      .finally(() => {
        this.isLoadingTx = false;
        loading.dismiss();
        this.router.navigate(['/dashboard']);
      });
  }

}
