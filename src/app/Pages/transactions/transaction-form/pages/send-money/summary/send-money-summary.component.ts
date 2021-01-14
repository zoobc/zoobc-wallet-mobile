import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { EnterpinsendPage } from 'src/app/Pages/send-coin/modals/enterpinsend/enterpinsend.page';
import { AuthService } from 'src/app/Services/auth-service';
import { TransactionService } from 'src/app/Services/transaction.service';
import { UtilService } from 'src/app/Services/util.service';
import { getTranslation } from 'src/Helpers/utils';
import Swal from 'sweetalert2';
import zoobc, { PostTransactionResponses, SendMoneyInterface } from 'zbc-sdk';

@Component({
  selector: 'app-send-money-summary',
  templateUrl: './send-money-summary.component.html',
  styleUrls: ['./send-money-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SendMoneySummaryComponent implements OnInit {


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
    console.log('=== this.formTrx: ', this.formTrx);
    this.total = this.formTrx.amount + this.formTrx.fee;
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
        this.sendMoney();
      }
    });

    return await pinmodal.present();
  }

  async sendMoney() {

    // show loading bar
    const loading = await this.loadingController.create({
      message: 'Please wait, submiting!',
      duration: 100000
    });

    await loading.present();


    const data: SendMoneyInterface = {
      sender: this.formTrx.sender.address,
      recipient: { value: this.formTrx.recipient.address, type: 0 },
      amount: Number(this.formTrx.amount),
      fee: Number(this.formTrx.fee)
    };


    if (this.formTrx.withEscrow) {
      const escrow = this.formTrx.behaviorEscrow;
      data.approverAddress = { value: escrow.approver.address, type: 0 };
      data.commission = escrow.commission ? escrow.commission : 0;
      data.timeout = escrow.timeout;
      data.instruction = escrow.instruction ? (escrow.instruction) : '';
    }

    console.log('== form: ', data);



    const childSeed = this.authSrv.keyring.calcDerivationPath(
      this.formTrx.sender.path
    );
    await zoobc.Transactions.sendMoney(data, childSeed)
      .then(
        async (res: PostTransactionResponses) => {
          const message = getTranslation('your transaction is processing', this.translate);
          const subMessage = getTranslation('you send coins to', this.translate, {
            amount: this.formTrx.amount,
            recipient: this.formTrx.recipient.address,
          });
          // Swal.fire(message, subMessage, 'success');

          this.utilSrv.showConfirmation(message, subMessage, true);
          this.router.navigateByUrl('/tabs/home');
          // this.router.navigate(['transaction-form/send-money/success']);
        },
        async err => {
          console.log(err);
          const message = 'Opps...';
          const subMessage = getTranslation(err.message, this.translate);
          this.utilSrv.showConfirmation( message, subMessage, false);
          // Swal.fire('Opps...', message, 'error');
          // loading.dismiss();
        }
      )
      .finally(() => {
        loading.dismiss();
      });
  }

}
