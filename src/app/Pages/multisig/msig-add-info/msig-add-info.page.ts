import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultisigService } from 'src/app/Services/multisig.service';
import { Router } from '@angular/router';
import { Account } from 'src/app/Interfaces/account';
import zoobc from 'zoobc-sdk';
import { AccountService } from 'src/app/Services/account.service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-msig-add-info',
  templateUrl: './msig-add-info.page.html',
  styleUrls: ['./msig-add-info.page.scss'],
})
export class MsigAddInfoPage implements OnInit, OnDestroy {
  stepper = {
    transaction: false,
    signatures: false,
  };
  account: Account;

  participants: string[];
  nonce: number;
  minSig: number;
  multisigSubs: Subscription;
  multisig: MultiSigDraft;

  constructor(
    private multisigServ: MultisigService,
    private router: Router,
    private accountService: AccountService
  ) {
  }

  ngOnDestroy(): void {
    if (this.multisigSubs) { this.multisigSubs.unsubscribe(); }
  }

  ngOnInit() {
    this.multisigSubs = this.multisigServ.multisig.subscribe( multisig => {
      const { multisigInfo, unisgnedTransactions, signaturesInfo } = multisig;
      if (multisigInfo === undefined) {
        this.router.navigate(['/multisig']);
      }

      this.multisig = multisig;
      console.log('=== this.multisig:', multisig);
      if (multisigInfo) {
        const { participants, minSigs, nonce } = multisigInfo;
        this.participants = participants;
        this.nonce = nonce;
        this.minSig = minSigs;
      } else  {
          this.loadDataAccount();
      }
      this.stepper.transaction = unisgnedTransactions !== undefined ? true : false;
      this.stepper.signatures = signaturesInfo !== undefined ? true : false;
    });
  }

  async loadDataAccount() {
    this.account = await this.accountService.getCurrAccount();
    const { participants, minSig, nonce } = this.account;
    this.participants = participants;
    this.nonce = nonce;
    this.minSig = minSig;
  }

  customTrackBy(index: number): any {
    return index;
  }

  saveDraft() {
    this.updateMultisig();
    if (this.multisig.id) {
      console.log('=== will edit');
      this.multisigServ.editDraft();
    } else {
      console.log('=== will save');
      this.multisigServ.saveDraft();
    }
    this.router.navigate(['/multisig']);
  }

  next() {

      this.updateMultisig();
      const { unisgnedTransactions, signaturesInfo } = this.multisig;
      if (unisgnedTransactions !== undefined) {
         this.router.navigate(['/msig-create-transaction']);
      } else if (signaturesInfo !== undefined) {
        this.router.navigate(['/msig-add-signatures']);
      } else {
        this.router.navigate(['/msig-send-transaction']);
      }

  }

  back() {
    this.router.navigateByUrl('/multisig');
  }

  updateMultisig() {
     const multisig = { ...this.multisig };
     this.participants.sort();
     this.participants = this.participants.filter(addrs => addrs !== '');

     multisig.multisigInfo = {
      minSigs: this.minSig,
      nonce: this.nonce,
      participants: this.participants,
      multisigAddress: '',
    };
     const address = zoobc.MultiSignature.createMultiSigAddress(multisig.multisigInfo);

     console.log('=== Multisig Address: ', address);
     multisig.generatedSender = address;
     this.multisigServ.update(multisig);
  }

}
