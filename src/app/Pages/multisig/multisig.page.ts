import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MultisigService } from 'src/app/Services/multisig.service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { AlertController } from '@ionic/angular';
import { dateAgo } from 'src/Helpers/utils';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Interfaces/account';
import zoobc, { isZBCAddressValid } from 'zoobc-sdk';
import { UtilService } from 'src/app/Services/util.service';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-multisig',
  templateUrl: './multisig.page.html',
  styleUrls: ['./multisig.page.scss']
})
export class MultisigPage implements OnInit {
  multiSigDrafts: MultiSigDraft[];

  addInfo = true;
  createTransaction = true;
  addSignature = true;
  multiSigCoPayer: any;
  isLoading: boolean;
  isError = false;

  isAddMultisigInfo: boolean;
  isSignature = false;
  isTransaction = true;
  isMultisigInfo = true;
  isMultiSignature = true;
  account: Account;

  participants: string[];
  nonce: number;
  minSig: number;
  multisigSubs: Subscription;
  multisig: MultiSigDraft;
  jsonFilePath = '';
  draftConent = '';
  alertConnectionTitle = '';
  alertConnectionMsg = '';
  networkSubscription = null;

  constructor(
    private router: Router,
    private accountSrv: AccountService,
    private alertController: AlertController,
    private multisigServ: MultisigService,
    private utilSrv: UtilService,
    private translateSrv: TranslateService,
    private network: Network
  ) {
    this.isMultisigInfo = true;
    this.isSignature = false;
    this.isTransaction = true;

    this.multisigSubs = this.multisigServ.multisig.subscribe(() => {
      this.getMultiSigDraft();
    });
  }

  async ngOnInit() {
    await this.getMultiSigDraft();
    this.goNextStep();
  }

  async getMultiSigDraft() {
    const currAccount = await this.accountSrv.getCurrAccount();
    this.account = currAccount;

    this.isMultiSignature = this.account.type !== 'multisig' ? false : true;

    const drafts = this.multisigServ.getDrafts();

    if (drafts) {
      this.multiSigDrafts = drafts;

      //   this.multiSigDrafts = drafts.filter(draft => {
      //     const { multisigInfo, transaction, generatedSender } = draft;
      //     if (generatedSender === currAccount.address) {
      //       return draft;
      //     }
      //     if (multisigInfo.participants.includes(currAccount.address)) {
      //       return draft;
      //     }
      //     if (transaction && transaction.sender === currAccount.address) {
      //       return draft;
      //     }
      //   })
      //     .sort()
      //     .reverse();
    }
  }

  getDate(pDate: number) {
    const newDate = new Date(pDate);
    return newDate;
  }

  goNextStep() {
    const multisig: MultiSigDraft = {
      accountAddress: '',
      fee: 0,
      id: 0
    };

    if (this.isMultisigInfo) {
      multisig.multisigInfo = null;
    }
    if (this.isTransaction) {
      multisig.unisgnedTransactions = null;
    }
    if (this.isSignature) {
      multisig.signaturesInfo = null;
    }

    if (this.isMultiSignature) {
      multisig.multisigInfo = {
        minSigs: this.account.minSig,
        nonce: this.account.nonce,
        participants: this.account.participants
      };
      const address = zoobc.MultiSignature.createMultiSigAddress(
        multisig.multisigInfo
      );
      multisig.generatedSender = address;
      this.multisigServ.update(multisig);
      if (this.isTransaction) {
        this.router.navigate(['/msig-create-transaction']);
      } else if (this.isSignature) {
        this.router.navigate(['/msig-add-signatures']);
      }
    } else {
      this.multisigServ.update(multisig);
      if (this.isMultisigInfo) {
        this.router.navigate(['/msig-add-info']);
      } else if (this.isTransaction) {
        this.router.navigate(['/msig-create-transaction']);
      } else if (this.isSignature) {
        this.router.navigate(['/msig-add-signatures']);
      }
    }
  }

  async onDeleteDraft(id: number) {
    this.presentDeleteConfirmation(id);
  }

  async presentDeleteConfirmation(id: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure want to delete!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // this.router.navigate(['/multisig']);
          }
        },
        {
          text: 'Oke',
          handler: () => {
            this.multisigServ.deleteDraft(id);
            this.getMultiSigDraft();
            this.router.navigate(['/multisig']);
          }
        }
      ]
    });

    await alert.present();
  }

  doDateAgo(pDate: any) {
    return dateAgo(pDate);
  }

  onEditDraft(idx: number) {
    const multisig: MultiSigDraft = this.multiSigDrafts[idx];
    const { multisigInfo, unisgnedTransactions, signaturesInfo } = multisig;
    this.multisigServ.update(multisig);

    if (signaturesInfo) {
      this.router.navigate(['/msig-add-signatures']);
    } else if (unisgnedTransactions) {
      this.router.navigate(['/msig-create-transaction']);
    } else if (multisigInfo) {
      this.router.navigate(['/msig-add-info']);
    }
  }

  validationFile(file: any): file is MultiSigDraft {
    if ((file as MultiSigDraft).generatedSender !== undefined) {
      return isZBCAddressValid((file as MultiSigDraft).generatedSender);
    }
    return false;
  }

  async presentAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmation',
      subHeader: title,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  public uploadFile(files: FileList) {
    if (files && files.length > 0) {
      const file = files.item(0);
      const fileReader: FileReader = new FileReader();
      fileReader.readAsText(file, 'JSON');
      fileReader.onload = async () => {
        const fileResult = JSON.parse(fileReader.result.toString());
        const validation = this.validationFile(fileResult);
        if (!validation) {
          const message = 'You imported the wrong file';
          this.presentAlert('Opps...', message);
        } else {
          this.multisigServ.update(fileResult);
          const listdraft = this.multisigServ.getDrafts();
          const checkExistDraft = listdraft.some(
            res => res.id === fileResult.id
          );

          if (checkExistDraft === true) {
            const message = 'There is same id in your draft';
            this.presentAlert('Opps...', message);
          } else {
            this.multisigServ.saveDraft();
            this.getMultiSigDraft();
            const subMessage = 'Your Draft has been saved';
            this.presentAlert('Success', subMessage);
          }
        }
      };
      fileReader.onerror = async err => {
        console.log(err);
        const message = 'An error occurred while processing your request';
        this.utilSrv.showConfirmation('Opps...', message, false, null);
      };
    }
  }

  showInfo() {
    this.addInfo = !this.addInfo;
  }

  doCreateTransaction() {
    this.createTransaction = !this.createTransaction;
  }

  doAddSignature() {
    this.addSignature = !this.createTransaction;
  }

  ionViewWillEnter() {
    this.networkSubscription = this.network
      .onDisconnect()
      .subscribe(async () => {
        const alert = await this.alertController.create({
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

    this.translateSrv.get('No Internet Access').subscribe((res: string) => {
      this.alertConnectionTitle = res;
    });

    this.translateSrv
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
}
