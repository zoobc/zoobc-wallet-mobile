import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { EnterpinsendPage } from 'src/app/Pages/send-coin/modals/enterpinsend/enterpinsend.page';
import { TrxstatusPage } from 'src/app/Pages/send-coin/modals/trxstatus/trxstatus.page';
import { AccountService } from 'src/app/Services/account.service';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { AuthService } from 'src/app/Services/auth-service';
import { TransactionService } from 'src/app/Services/transaction.service';
import { TRANSACTION_MINIMUM_FEE } from 'src/environments/variable.const';
import { calculateMinFee, sanitizeString } from 'src/Helpers/utils';
import {
  addressValidator,
  escrowFieldsValidator
} from 'src/Helpers/validators';
import zoobc, { SendMoneyInterface } from 'zoobc-sdk';

@Component({
  selector: 'app-blockchain-object-send',
  templateUrl: './blockchain-object-send.page.html',
  styleUrls: ['./blockchain-object-send.page.scss']
})
export class BlockchainObjectSendPage implements OnInit {
  withEscrow: boolean;
  allFees = this.transactionSrv.transactionFees(TRANSACTION_MINIMUM_FEE);

  private minimumFee = TRANSACTION_MINIMUM_FEE;

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

  constructor(
    private router: Router,
    public loadingController: LoadingController,
    private modalController: ModalController,
    public alertController: AlertController,
    public addressbookService: AddressBookService,
    private translateService: TranslateService,
    private authSrv: AuthService,
    private transactionSrv: TransactionService,
    private network: Network,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private accountSrv: AccountService
  ) {}

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

  behaviorEscrowChangesSubscription;
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
    this.sendMoneySummarySubscription = this.transactionSrv.transactionSuccessSubject.subscribe(
      async (result: boolean) => {
        if (result) {
          await this.inputPIN();
        }
      }
    );

    const account = await this.accountSrv.getCurrAccount();
    this.sender.setValue(account);
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

  async inputPIN() {
    const pinmodal = await this.modalController.create({
      component: EnterpinsendPage,
      componentProps: {}
    });

    pinmodal.onDidDismiss().then(async returnedData => {
      if (returnedData && returnedData.data && returnedData.data !== 0) {
        const pin = returnedData.data;

        const extras: NavigationExtras = {
          state: {
            amount: this.amount.value,
            recipient: this.recipient.value
          },
          replaceUrl: true
        };

        await this.sendMoney();

        this.router.navigate(['transaction-form/send-money/success'], extras);
      }
    });
    return await pinmodal.present();
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

      const extras: NavigationExtras = {
        state
      };
      this.router.navigate(['transaction-form/send-money/summary'], extras);
    }
  }

  async sendMoney() {
    // show loading bar
    const loading = await this.loadingController.create({
      message: 'Please wait, submiting!',
      duration: 50000
    });

    await loading.present();

    let data: SendMoneyInterface = {
      sender: this.sender.value.address,
      recipient: sanitizeString(this.recipient.value.address),
      fee: Number(this.fee.value),
      amount: this.amount.value
    };

    if (this.withEscrow) {
      data.approverAddress = this.behaviorEscrow.value.approver.address;
      data.commission = this.behaviorEscrow.value.commission;
      data.timeout = this.behaviorEscrow.value.timeout;
      data.instruction = sanitizeString(this.behaviorEscrow.value.instruction);
    }

    const childSeed = this.authSrv.keyring.calcDerivationPath(
      this.sender.value.path
    );
    await zoobc.Transactions.sendMoney(data, childSeed)
      .then(
        (resolveTx: any) => {
          if (resolveTx) {
            /*this.ngOnInit();
            this.showSuccessMessage();*/
            this.sendForm.reset();
            this.submitted = false;
            this.withEscrow = false;
            return;
          }
        },
        error => {
          console.log("__error", error);
          this.showErrorMessage(error);
        }
      )
      .finally(() => {
        loading.dismiss();
      });
  }

  onBehaviorEscrowChange() {
    this.minimumFee = this.behaviorEscrow.value && this.behaviorEscrow.value.timeout ?
      calculateMinFee(this.behaviorEscrow.value.timeout) : TRANSACTION_MINIMUM_FEE;

    this.setFeeValidation();
    this.setAmountValidation();
  }

  async showErrorMessage(error) {
    const modal = await this.modalController.create({
      component: TrxstatusPage,
      componentProps: {
        msg: error,
        status: false
      }
    });

    modal.onDidDismiss().then(() => {});

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
    });

    return await modal.present();
  }

  confirmSend() {
    this.router.navigate(['transaction-form/send-money/summary']);
  }

  async getMinimumFee(timeout: number) {
    const fee: number = calculateMinFee(timeout);
    return fee;
  }

  alertConnectionTitle: string = '';
  alertConnectionMsg: string = '';
  networkSubscription = null;
  sendMoneySummarySubscription = null;

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
        "Oops, it seems that you don't have internet connection. Please check your internet connection"
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

  ngOnDestroy() {
    if (this.sendMoneySummarySubscription) {
      this.sendMoneySummarySubscription.unsubscribe();
    }
  }
}
