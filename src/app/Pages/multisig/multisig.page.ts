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
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { UtilService } from 'src/app/Services/util.service';
import { makeShortAddress } from 'src/Helpers/converters';

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
  isSignature = false;
  isTransaction = false;
  isMultisigInfo = true;
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
    private multisigServ: MultisigService,
    private utilSrv: UtilService,
    private fileChooser: FileChooser) {

    this.isMultisigInfo = true;
    this.isSignature = false;
    this.isTransaction = false;
  }

  ngOnInit() {
    this.getMultiSigDraft();
  }

  shortAddress(arg: string) {
    return makeShortAddress(arg);
  }

  async getMultiSigDraft() {
    const currAccount = await this.accountSrv.getCurrAccount();
    this.account = currAccount;

    this.isMultiSignature = this.account.type !== 'multisig' ? false : true;

    const drafts = this.multisigServ.getDrafts();

    if (drafts) {
      this.multiSigDrafts = drafts.filter(draft => {
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
        this.router.navigate(['/msig-add-info']);
      } else if (this.isTransaction) {
        this.router.navigate(['/msig-create-transaction']);
      } else if (this.isSignature) {
        this.router.navigate(['/msig-add-signatures']);
      }
    }
  }

  async onDeleteDraft(e, id: number) {
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
            console.log('Confirm Cancel: blah');
            this.router.navigate(['/multisig']);
          }
        }, {
          text: 'Oke',
          handler: () => {
            console.log('Confirm Okay');

            this.multisigServ.deleteDraft(id);
            this.getMultiSigDraft();
            this.router.navigate(['/dashboard']);
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

  importDraft() {
    this.fileChooser.open().then(uri => {
        alert('== uri: ' + uri);
        console.log('=== fiel urei: ', uri);
        this.readFile(uri);
     }).catch(e => {
        console.log(e);
      }
    );
  }

  validationFile(file: any): file is MultiSigDraft {
    if ((file as MultiSigDraft).generatedSender !== undefined) {
      return isZBCAddressValid((file as MultiSigDraft).generatedSender);
    }
    return false;
  }

  readFile(file: any) {
    // const file = event.target.files[0];
    const fileReader = new FileReader();
    if (file !== undefined) {
      alert('-- enter to file ');
      fileReader.readAsText(file, 'JSON');
      fileReader.onload = async () => {
        const fileResult = JSON.parse(fileReader.result.toString());
        const validation = this.validationFile(fileResult);
        alert('-- enter to file 2 ');
        if (!validation) {
          alert('-- enter to file 3 ');

          const message = 'You imported the wrong file';
          this.utilSrv.showConfirmation('Opps...', message, false, null);
        } else {
          alert('-- enter to file 4 ');

          this.multisigServ.update(fileResult);
          const listdraft = this.multisigServ.getDrafts();
          const checkExistDraft = listdraft.some(res => res.id === fileResult.id);

          if (checkExistDraft === true) {
            const message = 'There is same id in your draft';
            this.utilSrv.showConfirmation('Opps...', message, false, null);
          } else {
            this.multisigServ.saveDraft();
            this.getMultiSigDraft();
            const message = 'Draft Saved';
            const subMessage = 'Your Draft has been saved';
            this.utilSrv.showConfirmation('Success', subMessage, true, null);
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

  refresh() {
    console.log('Refresh clicked');
  }

}
