import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { STORAGE_ESCROW_WAITING_LIST, STORAGE_ENC_PASSPHRASE_SEED, SALT_PASSPHRASE } from 'src/environments/variable.const';
import zoobc, { ZooKeyring, BIP32Interface } from 'zoobc';
import { StoragedevService } from 'src/app/Services/storagedev.service';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Interfaces/account';
import { ActivatedRoute } from '@angular/router';
import { doDecrypt } from 'src/Helpers/converters';
import CryptoJS from 'crypto-js';
import { AuthService } from 'src/app/Services/auth-service';


@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
})
export class TaskDetailPage implements OnInit {

  private keyring: ZooKeyring;

  waitingList = [];
  account: Account;
  escrowDetail: any;
  escrowId: any;

  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private strgSrv: StoragedevService,
    private accountService: AccountService,
    private authService: AuthService,
    private storageService: StoragedevService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      console.log('=== task detail Params: ', params);
      this.escrowId = params.escrowId;
    });
    this.loadDetail();
  }

  async loadDetail() {
    this.account = await this.accountService.getCurrAccount();
    this.waitingList = JSON.parse(await this.storageService.get(STORAGE_ESCROW_WAITING_LIST)) || [];
    if (this.waitingList.length > 50) {
      const reset = [];
      this.storageService.set(STORAGE_ESCROW_WAITING_LIST, JSON.stringify(reset));
    }

    await zoobc.Escrows.get(this.escrowId).then(res => {
      console.log('=== escrow detail: ', res);
      this.escrowDetail = res;
    });


  }
  closeModal() {
    this.modalCtrl.dismiss();
  }

  async generateSeed(pin: any) {

    console.log('===== generateSeed, account.path: ', this.account.path);
    console.log('==== generateSeed pin :', pin);

    const passEncryptSaved = await this.strgSrv.get(STORAGE_ENC_PASSPHRASE_SEED);
    console.log('==== generateSeed, passEncryptSaved:', passEncryptSaved);

    const decryptedArray = doDecrypt(passEncryptSaved, pin);
    console.log('=== generateSeed,  decryptedArray:', decryptedArray);

    const passphrase = decryptedArray.toString(CryptoJS.enc.Utf8);
    console.log('===== generateSeed,  passphrase: ', passphrase);

    this.keyring = new ZooKeyring(passphrase, SALT_PASSPHRASE);
    console.log('===== generateSeed,  this.keyring: ', this.keyring);

    const seed =  this.keyring.calcDerivationPath(this.account.path);
    console.log('===== generateSeed,  this.seed: ', seed);

    return seed;

  }

  async confirm(id: string) {
    console.log('============ pin confirm:', this.authService.pin);

    const checkWaitList = this.waitingList.includes(id);
    console.log('===  chekcWaitList: ', checkWaitList);

    const childSeed = await this.generateSeed(this.authService.pin);
    console.log('======== confirm childSeed: ', childSeed);

    const approval = this.account.address;
    console.log('======== confirm aproval: ', approval);

    console.log(' =========== escrow id: ', id);

    if (checkWaitList !== true) {

      const data = {
        approvalAddress: approval,
        fee: 1,
        approvalCode: 0,
        transactionId: id,
      };

      zoobc.Escrows.approval(data, childSeed)
        .then(
          async res => {
            console.log('======= res approval:', res);
            this.presentAlertSuccess('Approval success');
            this.waitingList.push(id);
            this.storageService.set(
              STORAGE_ESCROW_WAITING_LIST,
              JSON.stringify(this.waitingList)
            );

          },
          async err => {
            console.log('err', err);
            const message = err;
            this.presentAlertFail(message);
          }
        )
        .finally(() => {
          // close dialog
        });
    } else {
      const message = 'Transaction have been processed';
      this.presentAlertSuccess(message);
    }
  }


  async presentAlertSuccess(msg: string) {
    const alert = await this.alertController.create({
      header: 'Info',
      subHeader: 'Escrow approval success',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlertFail(msg: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Escrow approval fail',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  async reject(id: string) {
    const checkWaitList = this.waitingList.includes(id);
    const childSeed = await this.generateSeed(this.authService.pin);
    const approval = this.account.address;

    if (checkWaitList !== true) {
      const data = {
        approvalAddress: approval,
        fee: 1,
        approvalCode: 1,
        transactionId: id,
      };

      zoobc.Escrows.approval(data, childSeed)
        .then(
          async res => {
            const msg = res;

            this.presentAlertSuccess('Escrow reject success, ' + msg);
            this.waitingList.push(id);

            this.storageService.set(
              STORAGE_ESCROW_WAITING_LIST,
              JSON.stringify(this.waitingList)
            );
          },
          async err => {
            // this.isLoadingTx = false;
            console.log('err', err);
            const msg = 'An error occurred while processing your request, ' + err;
            this.presentAlertFail(msg);
          }
        )
        .finally(() => {
          // close dialog box
        });
    } else {
      const message = 'Transaction have been processed';
      this.presentAlertSuccess(message);
    }
  }

}
