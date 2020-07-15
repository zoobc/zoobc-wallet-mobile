import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultisigService } from 'src/app/Services/multisig.service';
import { Router } from '@angular/router';
import { Account } from 'src/app/Interfaces/account';
import zoobc from 'zoobc-sdk';
import { AccountService } from 'src/app/Services/account.service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { Subscription } from 'rxjs';
import { AccountPopupPage } from '../../account/account-popup/account-popup.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-msig-add-info',
  templateUrl: './msig-add-info.page.html',
  styleUrls: ['./msig-add-info.page.scss'],
})
export class MsigAddInfoPage implements OnInit, OnDestroy {

  account: Account;
  accounts: Account[];

  participants = ['', ''];

  nonce: number;
  minSig: number;
  multisigSubs: Subscription;
  multisig: MultiSigDraft;
  isMultiSignature = false;
  indexSelected: number;
  msigAccount: any;

  constructor(
    private multisigServ: MultisigService,
    private router: Router,
    private accountService: AccountService,
    private modalController: ModalController
  ) {
    console.log('--number 1');
    this.loadAllAccounts();
    console.log('--number 2');
  }

  ngOnDestroy(): void {
    if (this.multisigSubs) { this.multisigSubs.unsubscribe(); }
  }

  addParticipant() {
    console.log('=== participants: ', this.participants);
    this.participants.push('');
  }

  reduceParticipant() {
    const len = this.participants.length;
    console.log('=== Length particpants: ', len);
    if (len > 2) {
      this.participants.splice((len - 1), 1);
    }
  }

  async showPopupMultisigAccounts() {
    const modal = await this.modalController.create({
      component: AccountPopupPage,
      componentProps: {
        accType: 'multisig'
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        console.log('== data returned: ', dataReturned.data);
        this.msigAccount = dataReturned.data;
        if (this.msigAccount !== undefined) {
          this.participants = this.msigAccount.participants;
          this.nonce = this.msigAccount.nonce;
          this.minSig = this.msigAccount.minSig;
        }
      }
    });

    return await modal.present();
  }

  async showPopupAccount(index: number) {
    this.indexSelected = index;
    const modal = await this.modalController.create({
      component: AccountPopupPage
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.participants[this.indexSelected] =  dataReturned.data.address;
      }
    });

    return await modal.present();
  }


  async ngOnInit() {
    console.log('--number 4');
    this.multisigSubs = this.multisigServ.multisig.subscribe( async multisig => {
      console.log('--number 3');
      this.account = await this.accountService.getCurrAccount();
      this.isMultiSignature = this.account.type === 'multisig' ? true : false;
      const { multisigInfo, unisgnedTransactions, signaturesInfo } = multisig;
      if (multisigInfo === undefined) {
        this.router.navigate(['/multisig']);
      }

      this.multisig = multisig;
      console.log('=== this.multisig:', multisig);
      if (multisigInfo) {
        console.log('=== Enter 1:');
        const { participants, minSigs, nonce } = multisigInfo;
        this.participants = participants;
        this.nonce = nonce;
        this.minSig = minSigs;
      } else if (this.isMultiSignature) {
        console.log('=== Enter 2:');
        this.loadMultisigData();
      }
      console.log('=== Enter 3:');
    });
  }

  async loadAllAccounts() {
    this.accounts = await this.accountService.allAccount('multisig');
  }

  async loadMultisigData() {
    const account = await this.accountService.getCurrAccount();
    const { participants, minSig, nonce } = account;
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
    this.router.navigate(['/dashboard']);
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
