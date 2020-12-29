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
import { calculateMinFee } from 'src/Helpers/utils';
import {
  addressValidator,
  escrowFieldsValidator
} from 'src/Helpers/validators';
import zoobc, { SendMoneyInterface } from 'zbc-sdk';

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
          console.log('== result: ', result);
          console.log('=== setelah submit form...');
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
        // const pin = returnedData.data;
        await this.sendMoney();

        // const extras: NavigationExtras = {
        //   state: {
        //     amount: this.amount.value,
        //     recipient: this.recipient.value
        //   },
        //   replaceUrl: true
        // };
        // this.router.navigate(['transaction-form/send-money/success'], extras);

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

    const data: SendMoneyInterface = {
      sender:  this.sender.value.address,
      recipient: { value: this.recipient.value.address, type: 0 },
      fee: Number(this.fee.value),
      amount: Number(this.amount.value)
    };

    if (this.withEscrow) {
    data.approverAddress = { value: this.behaviorEscrow.value.approver.address, type: 0 };
    data.commission = this.behaviorEscrow.value.commission ? this.behaviorEscrow.value.commission : 0;
    data.timeout = this.behaviorEscrow.value.timeout;
    data.instruction = this.behaviorEscrow.value.instruction ?
        (this.behaviorEscrow.value.instruction) : '';
    }

    console.log('=== data: ', data);
    console.log('=== this.sender.value:', this.sender.value);

    const childSeed = this.authSrv.keyring.calcDerivationPath(
      this.sender.value.path
    );
    await zoobc.Transactions.sendMoney(data, childSeed)
      .then(
        (resolveTx: any) => {
          if (resolveTx) {
            this.ngOnInit();
            this.showSuccessMessage();

            if (this.behaviorEscrowChangesSubscription) {
              this.behaviorEscrowChangesSubscription.unsubscribe();
            }

            this.sendForm.reset();
            this.submitted = false;
            this.withEscrow = false;
            return;
          }
        },
        error => {
          console.log('__error', error);
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
      // this.navCtrl.pop();
      this.router.navigate(['tabs/home']);
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
