import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { TRANSACTION_MINIMUM_FEE, COIN_CODE } from 'src/environments/variable.const';
import zoobc, { MultisigPendingTxDetailResponse,
  MultisigPendingTxResponse, toGetPendingList, MultiSigInterface, signTransactionHash } from 'zoobc-sdk';
import { EnterpinsendPage } from '../../send-coin/modals/enterpinsend/enterpinsend.page';
import { Account } from 'src/app/Interfaces/account';
import { base64ToHex } from 'src/Helpers/utils';
import { TransactionService } from 'src/app/Services/transaction.service';
import { Currency } from 'src/app/Interfaces/currency';
import { CurrencyService } from 'src/app/Services/currency.service';
import { AccountService } from 'src/app/Services/account.service';
import { AuthService } from 'src/app/Services/auth-service';
import { UtilService } from 'src/app/Services/util.service';
import { makeShortAddress } from 'src/Helpers/converters';

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

  loadFeeAndCurrency() {
    this.optionFee = this.allFees[1].fee.toString();
    this.currencyRate = this.currencyService.getRate();
    this.secondaryCurr = this.currencyRate.name;
    this.customfeeTemp = this.allFees[2].fee;
    this.customfee = this.customfeeTemp;
    this.customfee2 = this.customfeeTemp * this.priceInUSD * this.currencyRate.value;
  }

  changeFee() {
    this.customeChecked = false;
    console.log('==== changeFee, trxFee: ', this.optionFee);
    if (Number(this.optionFee) < 0) {
      this.customeChecked = true;
      this.customfeeTemp = this.allFees[2].fee;
      this.convertCustomeFee();
    }
  }

  async loadDetail() {
    this.account = await this.accountService.getCurrAccount();
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

      this.pendingSignatures = res.pendingsignaturesList;
      console.log('=== pendingSignatures: ', this.pendingSignatures);

      this.participants = res.multisignatureinfo.addressesList;
      console.log('=== participants: ', this.participants);

      console.log('=== this.account.signByAddress: ', this.account.signByAddress);
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
    this.showPin();
  }

  shortAddress(arg: string) {
    return makeShortAddress(arg);
  }

  async showPin() {
    const pinmodal = await this.modalController.create({
      component: EnterpinsendPage
    });

    pinmodal.onDidDismiss().then((returnedData) => {
      console.log('=== returned after entr pin: ', returnedData);
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

    // TODO VALIDATE THIS
    this.transactionFee = Number(this.optionFee);
    if (this.customeChecked) {
      this.transactionFee = this.customfee;
    }

    if (!this.transactionFee) {
      this.transactionFee =  this.allFees[1].fee;
    }
    // end

    const key = this.authSrv.tempKey;
    const signByAddress = this.account.signByAddress;
    const signByAcc = await this.accountService.getAccount(signByAddress);
    const seed = await this.utilService.generateSeed(key, signByAcc.path);
    console.log('== sign Adddress: ', signByAcc.address);
    this.isLoadingTx = true;

    const data: MultiSigInterface = {
      accountAddress: signByAcc.address,
      fee: this.transactionFee,
      signaturesInfo: {
        txHash: this.multiSigDetail.transactionhash,
        participants: [
          {
            address: this.account.signByAddress,
            signature: signTransactionHash(this.multiSigDetail.transactionhash, seed),
          },
        ],
      },
    };

    console.log('== data: ', data);

    zoobc.MultiSignature.postTransaction(data, seed)
      .then( () => {
        const message = 'Transaction has been accepted';
        this.utilService.showConfirmation('Succes', message, true, null);
      })
      .catch( err => {
        console.log('== Error: ', err.message);
        const message = 'An error occurred while processing your request';
        this.utilService.showConfirmation('Fail', message, false, null);
      })
      .finally(() => {
        this.isLoadingTx = false;
        loading.dismiss();
        console.log('-- data afer: ', data);
        // this.goBack();
        this.router.navigate(['/dashboard']);
      });
  }

}
