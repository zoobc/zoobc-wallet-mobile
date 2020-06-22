import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultisigService } from 'src/app/Services/multisig.service';
import { Router } from '@angular/router';
import { Account } from 'src/app/Interfaces/account';
import zoobc from 'zoobc-sdk';
import { AccountService } from 'src/app/Services/account.service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';


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


  constructor(
    private multisigServ: MultisigService,
    private router: Router,
    private accountService: AccountService
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.loadData();
    //   this.stepper.transaction = unisgnedTransactions !== undefined ? true : false;
    //   this.stepper.signatures = signaturesInfo !== undefined ? true : false;
  }

  customTrackBy(index: number): any {
    return index;
  }

  async loadData() {
    this.account = await this.accountService.getCurrAccount();
    const { participants, minSig, nonce } = this.account;
    this.participants = participants;
    this.nonce = nonce;
    this.minSig = minSig;
  }


  saveDraft() {
    this.updateMultisig();
    this.multisigServ.saveDraft();
    this.router.navigate(['/multisig']);
  }

  next() {
    this.router.navigateByUrl('/msig-create-transaction');
    // if (this.form.valid) {
    //   this.updateMultisig();

    //   const { unisgnedTransactions, signaturesInfo } = this.multisig;
    //   if (unisgnedTransactions !== undefined) {
    //     this.router.navigate(['/multisignature/create-transaction']);
    //   } else if (signaturesInfo !== undefined) {
    //     this.router.navigate(['/multisignature/add-signatures']);
    //   } else {
    //     this.router.navigate(['/multisignature/send-transaction']);
    //   }
    // }
  }

  back() {
    this.router.navigateByUrl('/multisig');
  }

  updateMultisig() {
     const multisig: MultiSigDraft = {
      accountAddress: '',
      fee: 0,
      id: 0,
    };

    // this.participants.sort();
    // this.participants = this.participants.filter(addrs => addrs !== '');

    // multisig.multisigInfo = {
    //   minSigs: this.minSig,
    //   nonce: this.nonce,
    //   participants: this.participants,
    //   multisigAddress: '',
    // };
    // const address = zoobc.MultiSignature.createMultiSigAddress(multisig.multisigInfo);
    // multisig.generatedSender = address;
    // this.multisigServ.update(multisig);
  }

}
