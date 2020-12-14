import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { MultisigService } from 'src/app/Services/multisig.service';
import { TRANSACTION_MINIMUM_FEE } from 'src/environments/variable.const';
import { createInnerTxBytes, createInnerTxForm, getInputMap } from 'src/Helpers/multisig-utils';
import { getTranslation, stringToBuffer } from 'src/Helpers/utils';
import { generateTransactionHash } from 'zoobc-sdk';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-msig-create-transaction',
  templateUrl: './msig-create-transaction.page.html',
  styleUrls: ['./msig-create-transaction.page.scss']
})

export class MsigCreateTransactionPage implements OnInit, AfterViewInit, OnDestroy {
  isProcessing = false;
  minFee = TRANSACTION_MINIMUM_FEE;
  createTransactionForm: FormGroup;
  multisig: MultiSigDraft;
  multisigSubs: Subscription;

  stepper = {
    multisigInfo: false,
    signatures: false,
  };

  fieldList: object;
  readonlyInput = false;

  constructor(
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef) {
    const subs = this.multisigServ.multisig.subscribe(multisig => {
      this.createTransactionForm = createInnerTxForm(multisig.txType);
      this.fieldList = getInputMap(multisig.txType);
    });
    subs.unsubscribe();
  }

  ngOnInit() {
    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      const { multisigInfo, unisgnedTransactions, signaturesInfo, txBody } = multisig;

      if (unisgnedTransactions === undefined) {
        this.router.navigate(['/multisig']);
      }

      this.multisig = multisig;
      if (signaturesInfo && signaturesInfo.txHash) {
        this.readonlyInput = true;
      }

      const senderForm = this.createTransactionForm.get('sender');
      senderForm.setValue(multisig.generatedSender);

      if (txBody) {
        this.createTransactionForm.patchValue(txBody);
      }

      this.stepper.multisigInfo = multisigInfo !== undefined ? true : false;
      this.stepper.signatures = signaturesInfo !== undefined ? true : false;
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  async generateDownloadJsonUri() {
    alert('Coming soon!');
  }

  ngOnDestroy() {
    if (this.multisigSubs) { this.multisigSubs.unsubscribe(); }
  }

  async next() {
    try {
      if (this.multisig.signaturesInfo !== null) {
        this.readonlyInput = false;
      }

      if (this.createTransactionForm.valid) {
        this.updateCreateTransaction();
        const { signaturesInfo } = this.multisig;

        console.log('=== this.multisig: ', this.multisig);

        if (signaturesInfo === null) {
          const title = getTranslation('are you sure?', this.translate);
          const message = getTranslation('you will not be able to update the form anymore!', this.translate);
          const buttonText = getTranslation('yes, continue it!', this.translate);

          const isConfirm = await Swal.fire({
            title,
            text: message,
            showCancelButton: true,
            confirmButtonText: buttonText,
            type: 'warning',
          }).then(result => {
            if (result.value) {
              this.generatedTxHash();
              this.multisigServ.update(this.multisig);
              return true;
            } else { return false; }
          });
          if (!isConfirm) { return false; }
        }

        if (signaturesInfo === undefined) {
          this.router.navigate(['/msig-send-transaction']);
        } else {
          this.router.navigate(['/msig-add-info']);
        }
      }
    } catch (err) {
      console.log(err);
      const message = getTranslation(err.message, this.translate);
      return Swal.fire({ type: 'error', title: 'Oops...', text: message });
    }
  }

  updateCreateTransaction() {
    const multisig = { ...this.multisig };
    multisig.txBody = this.createTransactionForm.value;
    this.multisigServ.update(multisig);
  }

  back() {
    this.location.back();
  }

  generatedTxHash() {
    const { unisgnedTransactions, multisigInfo, signaturesInfo, txType } = this.multisig;
    const form = this.createTransactionForm.value;
    const signature = stringToBuffer('');
    if (unisgnedTransactions === null) {
      this.multisig.unisgnedTransactions = createInnerTxBytes(form, txType);
    }
    if (signaturesInfo !== undefined) {
      const txHash = generateTransactionHash(this.multisig.unisgnedTransactions);
      const participants = multisigInfo.participants.map(address => ({ address, signature }));
      this.multisig.signaturesInfo = { txHash, participants };
    }
  }

  saveDraft() {
    this.updateCreateTransaction();
    if (this.multisig.id) {
      this.multisigServ.editDraft();
    } else {
      this.multisigServ.saveDraft();
    }
    this.router.navigate(['/multisig']);
  }


}
