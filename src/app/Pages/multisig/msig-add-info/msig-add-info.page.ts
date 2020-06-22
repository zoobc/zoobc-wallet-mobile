import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MultisigService, MultiSigDraft } from 'src/app/services/multisig.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Account } from 'src/app/Interfaces/account';
import zoobc from 'zoobc-sdk';
import { AccountService } from 'src/app/Services/account.service';


@Component({
  selector: 'app-msig-add-info',
  templateUrl: './msig-add-info.page.html',
  styleUrls: ['./msig-add-info.page.scss'],
})
export class MsigAddInfoPage implements OnInit, OnDestroy {

  isMultiSignature = false;
  stepper = {
    transaction: false,
    signatures: false,
  };
  account: Account;

  form: FormGroup;
  participantsField = new FormArray([]);
  nonceField = new FormControl('', [Validators.required, Validators.min(1)]);
  minSignatureField = new FormControl('', [Validators.required, Validators.min(2)]);

  multisig: MultiSigDraft;
  multisigSubs: Subscription;

  constructor(
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location,
    private accountService: AccountService
  ) {
    this.form = new FormGroup({
      participants: this.participantsField,
      nonce: this.nonceField,
      minSigs: this.minSignatureField,
    });

    this.accountService.getCurrAccount().then(account => {
      this.account = account;
    });
    this.isMultiSignature = this.account.type === 'multisig' ? true : false;
  }

  ngOnInit() {
    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      const { multisigInfo, unisgnedTransactions, signaturesInfo } = multisig;
      if (multisigInfo === undefined) { this.router.navigate(['/multisignature']); }

      this.multisig = multisig;
      this.pushInitParticipant();

      if (multisigInfo) {
        const { participants, minSigs, nonce } = multisigInfo;
        this.patchParticipant(participants);
        this.nonceField.setValue(nonce);
        this.minSignatureField.setValue(minSigs);
      } else if (this.isMultiSignature) {
        const { participants, minSig, nonce } = this.account;
        this.patchParticipant(participants);
        this.nonceField.setValue(nonce);
        this.minSignatureField.setValue(minSig);
      }

      this.stepper.transaction = unisgnedTransactions !== undefined ? true : false;
      this.stepper.signatures = signaturesInfo !== undefined ? true : false;
    });
  }

  ngOnDestroy() {
    if (this.multisigSubs) { this.multisigSubs.unsubscribe(); }
  }

  pushInitParticipant(minParticpant: number = 2) {
    while (this.participantsField.length > 0) { this.participantsField.removeAt(0); }

    for (let i = 0; i < minParticpant; i++) {
      this.participantsField.push(new FormControl('', [Validators.required]));
    }
  }

  patchParticipant(participants: string[]) {
    while (this.participantsField.controls.length !== 0) { this.participantsField.removeAt(0); }

    participants.forEach((pcp, index) => {
      if (index <= 1) {
        this.participantsField.push(new FormControl(pcp, [Validators.required]));
      } else {
        this.participantsField.push(new FormControl(pcp));
      }
    });
  }

  onSwitchAccount(account: Account) {
    if (account !== undefined) {
      this.patchParticipant(account.participants);
      this.nonceField.setValue(account.nonce);
      this.minSignatureField.setValue(account.minSig);
    }
  }

  addParticipant() {
    this.participantsField.push(new FormControl(''));
  }

  removeParticipant(index: number) {
    this.participantsField.removeAt(index);
  }

  saveDraft() {
    this.updateMultisig();
    if (this.multisig.id) {
      this.multisigServ.editDraft();
    } else { this.multisigServ.saveDraft(); }
    this.router.navigate(['/multisignature']);
  }

  next() {
    if (this.form.valid) {
      this.updateMultisig();

      const { unisgnedTransactions, signaturesInfo } = this.multisig;
      if (unisgnedTransactions !== undefined) {
        this.router.navigate(['/multisignature/create-transaction']);
      } else if (signaturesInfo !== undefined) {
        this.router.navigate(['/multisignature/add-signatures']);
      } else {
        this.router.navigate(['/multisignature/send-transaction']);
      }
    }
  }

  back() {
    this.location.back();
  }

  updateMultisig() {
    const { minSigs, nonce } = this.form.value;
    const multisig = { ...this.multisig };

    let participants: string[] = this.form.value.participants;
    participants.sort();
    // tslint:disable-next-line:no-shadowed-variable
    participants = participants.filter(address => address !== '');

    multisig.multisigInfo = {
      // tslint:disable-next-line:radix
      minSigs: parseInt(minSigs),
      // tslint:disable-next-line:radix
      nonce: parseInt(nonce),
      participants,
      multisigAddress: '',
    };
    const address = zoobc.MultiSignature.createMultiSigAddress(multisig.multisigInfo);
    multisig.generatedSender = address;
    this.multisigServ.update(multisig);
  }

}