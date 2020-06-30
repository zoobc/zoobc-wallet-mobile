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

@Component({
  selector: 'app-multisig',
  templateUrl: './multisig.page.html',
  styleUrls: ['./multisig.page.scss'],
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
  isSignature: boolean;
  isTransaction: boolean;
  isMultisigInfo: boolean;
  isMultiSignature = true;
  account: Account;

  participants: string[];
  nonce: number;
  minSig: number;
  multisigSubs: Subscription;
  multisig: MultiSigDraft;

  constructor(
    private router: Router,
    private accountSrv: AccountService,
    private alertController: AlertController,
    private multisigServ: MultisigService) {
      this.isMultisigInfo = true;
    }

  ionViewDidEnter() {
    this.getMultiSigDraft();
  }

  ngOnInit() {
    this.getMultiSigDraft();
  }

  async getMultiSigDraft() {
    const currAccount = await this.accountSrv.getCurrAccount();
    this.account = currAccount;
    this.multiSigDrafts = this.multisigServ
      .getDrafts()
      .filter(draft => {
        const { multisigInfo, transaction, generatedSender } = draft;
        if (generatedSender === currAccount.address) {
          return draft;
        }
        if (multisigInfo.participants.includes(currAccount.address)) {
          return draft;
        }
        if (transaction && transaction.sender === currAccount.address) {
          return draft;
        }
      })
      .sort()
      .reverse();
  }

  getDate(pDate: number) {
    const newDate = new Date(pDate);
    return newDate;
  }

  goNextStep() {
    const multisig: MultiSigDraft = {
      accountAddress: '',
      fee: 0,
      id: 0,
    };

    if (this.isMultisigInfo) { multisig.multisigInfo = null; }
    if (this.isTransaction) { multisig.unisgnedTransactions = null; }
    if (this.isSignature) { multisig.signaturesInfo = null; }

    console.log('=== Multisig: ', multisig);

    if (this.isMultiSignature) {
      multisig.multisigInfo = {
        minSigs: this.account.minSig,
        nonce: this.account.nonce,
        participants: this.account.participants,
        multisigAddress: '',
      };
      const address = zoobc.MultiSignature.createMultiSigAddress(multisig.multisigInfo);
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
        this.router.navigate(['/msig-add-multisig-info']);
      } else if (this.isTransaction) {
        this.router.navigate(['/msig-create-transaction']);
      } else if (this.isSignature) {
        this.router.navigate(['/msig-add-signatures']);
      }
    }
  }

  async onDeleteDraft(e, id: number) {
    this.presentDeleteConfirmation(e, id);
  }

  async presentDeleteConfirmation(e, id: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure want to delete!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            return false;
          }
        }, {
          text: 'Oke',
          handler: () => {
            console.log('Confirm Okay');

            this.multisigServ.deleteDraft(id);
            this.getMultiSigDraft();
            return true;

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
    this.multisigServ.update(multisig);
    const { multisigInfo, unisgnedTransactions, signaturesInfo } = multisig;
    if (multisigInfo) {
      this.router.navigate(['/msig-add-info']);
    } else if (unisgnedTransactions) {
      this.router.navigate(['/msig-create-transaction']);
    } else if (signaturesInfo) {
      this.router.navigate(['/msig-add-signatures']);
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

  next() {
    console.log('Next clicked');
  }

  refresh() {
    console.log('Refresh clicked');
  }

}
