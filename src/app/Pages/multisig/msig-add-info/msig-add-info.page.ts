import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultisigService } from 'src/app/Services/multisig.service';
import { Router } from '@angular/router';
import { Account } from 'src/app/Interfaces/account';
import zoobc from 'zbc-sdk';
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
  name: string;
  address: string;

  constructor(
    private multisigSrv: MultisigService,
    private router: Router,
    private accountSrv: AccountService,
    private modalController: ModalController
  ) {
    this.loadAllAccounts();
  }

  ngOnDestroy(): void {
    if (this.multisigSubs) { this.multisigSubs.unsubscribe(); }
  }

  addParticipant() {
    this.participants.push('');
  }

  reduceParticipant() {
    const len = this.participants.length;
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
        this.msigAccount = dataReturned.data;
        if (this.msigAccount !== undefined) {
          this.petchMsigAccount(this.msigAccount);
        }
      }
    });

    return await modal.present();
  }

  petchMsigAccount(acc: Account) {
    // this.participants = acc.participants;
    this.name = acc.name;
    // this.address = acc.address;
    this.nonce = acc.nonce;
    this.minSig = acc.minSig;
  }

  async showPopupAccount(index: number) {
    this.indexSelected = index;
    const modal = await this.modalController.create({
      component: AccountPopupPage
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.participants[this.indexSelected] = dataReturned.data.address;
      }
    });

    return await modal.present();
  }


  async ngOnInit() {
    this.multisigSubs = this.multisigSrv.multisig.subscribe(async multisig => {
      this.account = await this.accountSrv.getCurrAccount();
      this.isMultiSignature = this.account.type === 'multisig' ? true : false;
      const { multisigInfo, unisgnedTransactions, signaturesInfo } = multisig;
      if (multisigInfo === undefined) {
        this.router.navigate(['/multisig']);
      }

      this.multisig = multisig;
      if (multisigInfo) {
        const { participants, minSigs, nonce } = multisigInfo;
        // this.participants = participants;
        this.nonce = nonce;
        this.minSig = minSigs;
      } else if (this.isMultiSignature) {
        this.loadMultisigData();
      }
    });
  }

  async loadAllAccounts() {
    this.accounts = await this.accountSrv.allAccount('multisig');
    if (this.accounts && this.accounts.length > 0) {
      this.msigAccount = this.accounts[0];
      this.petchMsigAccount(this.msigAccount);
    }
  }

  async loadMultisigData() {
    const account = await this.accountSrv.getCurrAccount();
    const { participants, minSig, nonce } = account;
    // this.participants = participants;
    this.nonce = nonce;
    this.minSig = minSig;
  }

  customTrackBy(index: number): any {
    return index;
  }

  saveDraft() {
    this.updateMultisig();
    if (this.multisig.id) {
      this.multisigSrv.editDraft();
    } else {
      this.multisigSrv.saveDraft();
    }
    this.router.navigate(['/dashboard']);
  }

  next() {
    this.updateMultisig();
    if (!this.multisig.unisgnedTransactions) {
      this.router.navigate(['/msig-create-transaction']);
    } else if (!this.multisig.signaturesInfo) {
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

    // multisig.multisigInfo = {
    //   minSigs: this.minSig,
    //   nonce: this.nonce,
    //   // participants: this.participants
    // };
    const address = zoobc.MultiSignature.createMultiSigAddress(multisig.multisigInfo);
    multisig.generatedSender = address;
    this.multisigSrv.update(multisig);
  }

}
