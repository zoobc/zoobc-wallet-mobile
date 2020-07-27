import { Component, OnInit } from '@angular/core';
import { EMPTY_STRING } from 'src/environments/variable.const';
import { Account } from 'src/app/Interfaces/account';
import { makeShortAddress } from 'src/Helpers/converters';
import { AccountService } from 'src/app/Services/account.service';
import { Router } from '@angular/router';
import { sanitizeString } from 'src/Helpers/utils';
import {MultiSigAddress} from 'zoobc-sdk';
import { ModalController } from '@ionic/angular';
import { AccountPopupPage } from '../account-popup/account-popup.page';
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss']
})
export class CreateAccountPage implements OnInit {


  account: Account;
  accountName = EMPTY_STRING;
  validationMessage = EMPTY_STRING;
  isNameValid = true;
  accounts: Account[];
  isMultisig: boolean;
  participants = ['', ''];
  signBy: string;
  signByAccount: Account;
  nonce: number;
  minimumSignature: number;
  numOfParticipant = 2;
  indexSelected: number;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private modalController: ModalController
  ) {
  }

  async ngOnInit() {
    this.accounts = await this.accountService.allAccount('normal');
    const len = this.accounts.length + 1;
    this.accountName = `Account ${len}`;
  }

  async changeToMultisig() {
      if (this.isMultisig) {
        this.accounts = await this.accountService.allAccount('multisig');
        let len = 1;
        if (this.accounts && this.accounts.length > 0) {
          len = this.accounts.length + 1;
        }
        this.accountName = `Multisig Account ${len}`;
      } else {
        this.accounts = await this.accountService.allAccount('normal');
        const len = this.accounts.length + 1;
        this.accountName = `Account ${len}`;
      }
  }

  async createOrUpdateAccount() {
    this.isNameValid = true;
    if (!this.accountName) {
      this.validationMessage = 'Name is required';
      this.isNameValid = false;
      return;
    }

    if (this.isNameExists(this.accountName)) {
      this.isNameValid = false;
      return;
    }

    await this.createAccount();

  }

  isNameExists(name: string) {
    this.validationMessage = '';
    const isExists = this.accounts.find(acc => {
      if (name && acc.name.trim().toLowerCase() === name.trim().toLowerCase()) {
        this.validationMessage = 'Name exists with address: ' + makeShortAddress(acc.address);
        return true;
      }
      return false;
    });
    return isExists;
  }

  sanitize() {
    this.accountName = sanitizeString(this.accountName);
  }

  changeParticipant() {

      const len = this.participants.length;
      if (this.numOfParticipant < 2) {
        this.numOfParticipant = 2;
        return;
      }

      for (let i = 2; i < this.numOfParticipant; i++) {
        this.participants.push('');
      }
  }

  async createAccount() {

    const pathNumber = await this.accountService.generateDerivationPath();
    let account: Account = this.accountService.createNewAccount(this.accountName.trim(), pathNumber);

    if (this.isMultisig) {
      // this.participants = this.participants.sort();
      const multiParam: MultiSigAddress = {
        participants: this.participants,
        nonce: this.nonce,
        minSigs: this.minimumSignature
      };
      account = this.accountService.createNewMultisigAccount(this.accountName.trim(), multiParam, this.signByAccount);
    }
    this.accountService.addAccount(account);
    this.accountService.broadCastNewAccount(account);
    this.goListAccount();
  }

  goListAccount() {
    this.router.navigateByUrl('/list-account');
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

  customTrackBy(index: number): any {
    return index;
  }

  async showPopupAccount(index: number) {
    this.indexSelected = index;
    const modal = await this.modalController.create({
      cssClass: 'zbc-modal',
      component: AccountPopupPage,
      componentProps: {
        idx: index
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.participants[this.indexSelected] =  dataReturned.data.address;
      }
    });

    return await modal.present();
  }


  async showPopupSignBy() {
    const modal = await this.modalController.create({
      component: AccountPopupPage
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.signByAccount =  dataReturned.data;
        this.signBy = this.signByAccount.address;
      }
    });

    return await modal.present();
  }
}
