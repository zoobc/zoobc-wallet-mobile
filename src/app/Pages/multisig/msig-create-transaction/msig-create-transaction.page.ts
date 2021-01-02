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
import { NavController } from '@ionic/angular';


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
    private router: Router,
    private navCtrl: NavController,
    private translate: TranslateService) {
    // const subs = this.multisigServ.multisig.subscribe(multisig => {
    //   this.formTrx = createInnerTxForm(multisig.txType);
    //   this.fieldList = getInputMap(multisig.txType);
    // });
    // subs.unsubscribe();
  }

  ngOnInit() {
    this.draft  = this.multisigServ.multisigDraft;
    if (this.draft) {
      console.log('== Multisig: ', this.draft);
      this.formTrx = createInnerTxForm(this.draft.txType);
      this.fieldList = getInputMap(this.draft.txType);

      const { txBody } = this.draft;
      const senderForm = this.formTrx.get('sender');
      senderForm.setValue(txBody.sender.value);

    }
  }

  async generateDownloadJsonUri() {
    alert('Coming soon!');
  }

  async next() {

    try {
      if (this.formTrx.valid) {
        this.updateDraft();
        console.log('----: this.createTransactionForm: ', this.formTrx.value);
        console.log('=== this.multisig: ', this.draft);
        this.multisigServ.update(this.draft);
        // if (signaturesInfo === null) {
        //   const title = getTranslation('are you sure?', this.translate);
        //   const message = getTranslation('you will not be able to update the form anymore!', this.translate);
        //   const buttonText = getTranslation('yes, continue it!', this.translate);

        //   const isConfirm = await Swal.fire({
        //     title,
        //     text: message,
        //     showCancelButton: true,
        //     confirmButtonText: buttonText,
        //     type: 'warning',
        //   }).then(result => {
        //     if (result.value) {
        //       this.generatedTxHash();
        //       this.multisigServ.update(this.multisig);
        //       return true;
        //     } else { return false; }
        //   });
        //   if (!isConfirm) { return false; }
        // }


        this.router.navigate(['/msig-send-transaction']);
      }
    } catch (err) {
      console.log(err);
      const message = getTranslation(err.message, this.translate);
      return Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
  }

  updateDraft() {

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

  saveDraft() {
    this.updateDraft();
    this.multisigServ.update(this.draft);
    if (this.draft.id) {
      this.multisigServ.editDraft();
    } else {
      this.multisigServ.saveDraft();
    }
    this.router.navigate(['/multisig']);
  }

  goHome() {
    this.navCtrl.navigateRoot('/tabs/home');
  }

}
