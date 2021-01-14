import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { MultisigService } from 'src/app/Services/multisig.service';
import { TRANSACTION_MINIMUM_FEE } from 'src/environments/variable.const';
import { createInnerTxBytes, createInnerTxForm, getInputMap } from 'src/Helpers/multisig-utils';
import { getTranslation, stringToBuffer } from 'src/Helpers/utils';
import { Address, generateTransactionHash } from 'zbc-sdk';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { AlertController, NavController } from '@ionic/angular';


@Component({
  selector: 'app-msig-create-transaction',
  templateUrl: './msig-create-transaction.page.html',
  styleUrls: ['./msig-create-transaction.page.scss']
})

export class MsigCreateTransactionPage implements OnInit {
  isProcessing = false;
  minFee = TRANSACTION_MINIMUM_FEE;
  formTrx: FormGroup;
  draft: MultiSigDraft;

  fieldList: object;
  constructor(
    private multisigServ: MultisigService,
    private alertController: AlertController,
    private router: Router,
    private navCtrl: NavController,
    private translate: TranslateService) {
  }

  ngOnInit() {
    this.draft = this.multisigServ.draft;
    if (this.draft) {
      console.log('== Multisig: ', this.draft);
      this.formTrx = createInnerTxForm(this.draft.txType);
      this.fieldList = getInputMap(this.draft.txType);

      const { txBody } = this.draft;
      const senderForm = this.formTrx.get('sender');
      senderForm.setValue(txBody.sender.value);

    }
  }

  async generateUri() {
    alert('Coming soon!');
  }

  async next() {
    this.update();

    try {
      if (this.formTrx.valid) {
        const confirmation = await this.showOption();
        console.log('=== confirmation is', confirmation);
        if (confirmation === 'onchain') {
          this.multisigServ.update(this.draft);
          this.router.navigate(['/msig-send-transaction']);
        } else if (confirmation === 'offchain') {
          this.doOffchain();
        }
      }
    } catch (err) {
      console.log(err);
      const message = getTranslation(err.message, this.translate);
      return Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
  }
  async doOffchain() {
    const title = getTranslation('are you sure?', this.translate);
    const message = getTranslation('you will not be able to update the form anymore!', this.translate);
    const buttonText = getTranslation('yes, continue it!', this.translate);
    const isConfirm = await Swal.fire({
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: buttonText,
      type: 'warning',
    }).then(result => result.value);
    if (!isConfirm) { return false; }
    this.generateTxHash();
    this.saveDraft();
  }

  saveDraft() {
    this.multisigServ.update(this.draft);
    this.multisigServ.save();
    this.router.navigate(['/multisig']);
  }

  generateTxHash() {
    const {txBody, multisigInfo, txType } = this.draft;
    const form = { ...txBody };
    console.log('.. form: ', form);
    const signature = stringToBuffer('');
    console.log('.. 1: ', signature);
    const unisgnedTransactions = createInnerTxBytes(form, txType);
    console.log('.. unisgnedTransactions: ', unisgnedTransactions);
    const txHash = generateTransactionHash(unisgnedTransactions);
    console.log('.. txHash: ', txHash);
    const participants = multisigInfo.participants.map(address => ({ address, signature }));
    console.log('.. participants: ', participants);

    this.draft.unisgnedTransactions = unisgnedTransactions;
    this.draft.signaturesInfo = { txHash, participants };
  }

  update() {
    // extract value form
    const form = this.formTrx.value;
    if (form.recipient) {
      const recipient: Address = { value: form.recipient.address, type: 0 };
      form.recipient = recipient;
    }

    if (form.sender) {
      const sender: Address = { value: form.sender, type: 0 };
      form.sender = sender;
    }

    if (form.addressApprover) {
      const approver: Address = { value: form.addressApprover.address, type: 0 };
      form.addressApprover = approver;
    }

    if (form.recipientAddress) {
      const recipientAddress: Address = { value: form.recipientAddress, type: 0 };
      form.recipientAddress = recipientAddress;
    }

    // end

    this.draft.txBody = form;

  }

  makeHash() {
    const { unisgnedTransactions, multisigInfo, signaturesInfo, txType } = this.draft;
    const form = this.formTrx.value;
    const signature = stringToBuffer('');
    if (unisgnedTransactions === null) {
      this.draft.unisgnedTransactions = createInnerTxBytes(form, txType);
    }
    if (signaturesInfo !== undefined) {
      const txHash = generateTransactionHash(this.draft.unisgnedTransactions);
      const participants = multisigInfo.participants.map(address => ({ address, signature }));
      this.draft.signaturesInfo = { txHash, participants };
    }
  }

  save() {
    this.update();
    this.multisigServ.update(this.draft);
    if (this.draft.id) {
      this.multisigServ.edit();
    } else {
      this.multisigServ.save();
    }
    this.router.navigate(['/multisig']);
  }

  goHome() {
    this.navCtrl.navigateRoot('/tabs/home');
  }

  async showOption() {
    return new Promise(async (resolve) => {
      const confirm = await this.alertController.create({
        header: 'confirm',
        message: 'How do you want multi signature to be executed?',
        inputs: [
          {
            name: 'rdOnChain',
            type: 'radio',
            label: 'Onchain Multi Signature',
            value: 'onchain',
            checked: true
          },
          {
            name: 'rdOffChain',
            type: 'radio',
            label: 'Offchain Multi Signature',
            value: 'offchain'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (data) => {
              return resolve(data);
            }
          }, {
            text: 'Next',
            handler: (data) => {
              return resolve(data);
            }
          }
        ]
      });

      await confirm.present();
    });
  }
}

