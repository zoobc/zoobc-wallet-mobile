import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MultisigService } from 'src/app/Services/multisig.service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { AlertController, ModalController } from '@ionic/angular';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Interfaces/account';
import { TransactionType } from 'zbc-sdk';
import { ImportDraftPage } from './import-draft/import-draft.page';
import { THEME_OPTIONS } from 'src/environments/variable.const';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { getTxType } from 'src/Helpers/multisig-utils';
import { getTranslation } from 'src/Helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-multisig',
  templateUrl: './multisig.page.html',
  styleUrls: ['./multisig.page.scss']
})
export class MultisigPage implements OnInit {

  txType = [
    { code: TransactionType.SENDMONEYTRANSACTION, type: 'send money' },
    { code: TransactionType.SETUPACCOUNTDATASETTRANSACTION, type: 'setup account dataset' },
    { code: TransactionType.REMOVEACCOUNTDATASETTRANSACTION, type: 'remove account dataset' },
    { code: TransactionType.APPROVALESCROWTRANSACTION, type: 'escrow approval' },
  ];

  account: Account;
  multisigForm: FormGroup;
  multiSigDrafts: MultiSigDraft[];
  fTrxType = new FormControl(TransactionType.SENDMONEYTRANSACTION, Validators.required);
  fChainType = new FormControl('onchain', Validators.required);
  themes = THEME_OPTIONS;
  isAccMultisig = false;
  innerTransaction = false;
  draftTxType: string[] = [];
  signatures = false;
  draftSignedBy: number[] = [];
  isShowForm = false;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private alertController: AlertController,
    private multisigServ: MultisigService,
    private modalController: ModalController,
    private translate: TranslateService,
    private formBuilder: FormBuilder) {

    this.multisigForm = this.formBuilder.group({
      trxType: this.fTrxType,
      chainType: this.fChainType
    });

  }

  showForm() {
    this.isShowForm = true;
  }

  async ngOnInit() {
    this.getAccountType();
  }

  async getAccountType() {
    this.account = await this.accountService.getCurrAccount();
    this.isAccMultisig = this.account.type === 'multisig' ? true : false;
  }

  async next() {

    const txType = this.fTrxType.value;
    const multisig: MultiSigDraft = {
      accountAddress: null,
      fee: 0,
      id: 0,
      multisigInfo: null,
      unisgnedTransactions: null,
      signaturesInfo: null,
      txType,
      txBody: {},
    };

    if (this.isAccMultisig) {
      const accounts = (await this.accountService
        .allAccount())
        .filter(acc => this.account.participants.some(address => address.value === acc.address.value));

      // if no address on the participants
      if (accounts.length < 1) {
        const message = getTranslation('you dont have any account that in participant list', this.translate);
        Swal.fire({ type: 'error', title: 'Oops...', text: message });
        return false;
      }

      multisig.multisigInfo = {
        minSigs: this.account.minSig,
        nonce: this.account.nonce,
        participants: this.account.participants,
      };

      // const address = zoobc.MultiSignature.createMultiSigAddress(multisig.multisigInfo);
      multisig.txBody.sender = this.account.address;
      // multisig.accountAddress = this.account.address;
      console.log('... this.multisig:', multisig);

      this.multisigServ.update(multisig);
      this.router.navigate(['/msig-create-transaction']);
    } else {
      this.multisigServ.update(multisig);
      this.router.navigate(['/msig-add-info']);
    }
  }

  async getDraft() {

    const msigDraft = this.multisigServ.getDrafts();
    if (!msigDraft) {
      return;
    }

    this.multiSigDrafts = (await this.multisigServ
      .getDrafts())
      .filter(draft => {
        const { multisigInfo, txBody, generatedSender } = draft;
        if (generatedSender === this.account.address) { return draft; }
        if (multisigInfo.participants.includes(this.account.address)) { return draft; }
        if (txBody && txBody.sender === this.account.address) { return draft; }
      })
      .sort()
      .reverse();

    this.multiSigDrafts.forEach((draft, i) => {
      let total = 0;
      if (draft.signaturesInfo) {
        draft.signaturesInfo.participants.forEach(p => {
          total += Buffer.from(p.signature).length > 0 ? 1 : 0;
        });
      }
      this.draftSignedBy[i] = total;
      this.draftTxType[i] = getTxType(draft.txType);
    });
  }


  async import() {
    const importDraft = await this.modalController.create({
      component: ImportDraftPage,
      componentProps: {}
    });

    importDraft.onDidDismiss().then(returnedData => {
      console.log('=== returneddata: ', returnedData);
      if (returnedData && returnedData.data !== 0) {
        alert('Draft has been successfully imported');
      }
    });
    return await importDraft.present();
  }

  async delete(id: number) {
    this.showConfirmation(id);
  }

  async showConfirmation(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure want to delete!',
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
            this.getDraft();
            this.router.navigate(['/multisig']);
          }
        }
      ]
    });

    await alert.present();
  }

  edit(idx: number) {
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

  close() {
    this.isShowForm = false;
  }
}
