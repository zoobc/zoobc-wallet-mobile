import { Component, OnInit } from '@angular/core';
import { EMPTY_STRING } from 'src/environments/variable.const';
import { Account } from 'src/app/Interfaces/account';
import { makeShortAddress } from 'src/Helpers/converters';
import { AccountService } from 'src/app/Services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { sanitizeString } from 'src/Helpers/utils';
import { ModalController } from '@ionic/angular';
import { AccountPopupPage } from '../account-popup/account-popup.page';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.page.html',
  styleUrls: ['./edit-account.page.scss'],
})
export class EditAccountPage implements OnInit {


  account: Account;
  // accountName = EMPTY_STRING;
  validationMessage = EMPTY_STRING;
  isNameValid = true;
  accounts: Account[];
  // participants = ['', ''];
  // signBy: string;
  // nonce: number;
  // minimumSignature: number;
  indexSelected: number;
  signByAccount: Account;
  oldName: string;

  constructor(
    private accountService: AccountService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private modalController: ModalController
  ) {
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.account = JSON.parse(params.account);
      if (this.account) {
        this.oldName = this.account.name;
      }
    });

    if (this.account && this.account.type === 'multisig') {
      this.loadMultisigAccount();
    } else {
      this.loadNormalAccount();
    }
  }

  async loadMultisigAccount() {
    this.accounts = await this.accountService.allAccount('multisig');
    this.signByAccount = await this.accountService.getAccount(this.account.signByAddress);
  }

  async loadNormalAccount() {
    this.accounts = await this.accountService.allAccount('normal');
  }

  async UpdateAccount() {

    this.isNameValid = true;
    if (!this.account.name) {
      this.validationMessage = 'Name is required';
      this.isNameValid = false;
      return;
    }

    if (this.account.type !== 'multisig' && this.oldName === this.account.name) {
      this.accountService.broadCastNewAccount(this.account);
      this.goListAccount();
      return;
    }

    if (this.oldName !== this.account.name && this.isNameExists(this.account.name)) {
      this.validationMessage = 'Name is Exists';
      this.isNameValid = false;
      return;
    }
    this.account.name = sanitizeString(this.account.name);
    this.accountService.updateAccount(this.account);
    this.accountService.broadCastNewAccount(this.account);
    this.goListAccount();

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

  goListAccount() {
    this.router.navigateByUrl('/list-account');
  }


  addParticipant() {
    this.account.participants.push('');
  }

  reduceParticipant() {
    const len = this.account.participants.length;
    if (len > 2) {
      this.account.participants.splice((len - 1), 1);
    }
  }

  customTrackBy(index: number): any {
    return index;
  }

  async showPopupAccount(index: number) {
    this.indexSelected = index;
    const modal = await this.modalController.create({
      component: AccountPopupPage,
      componentProps: {
        idx: index
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.account.participants[this.indexSelected] =  dataReturned.data.address;
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
        this.account.signByAddress = this.signByAccount.address;
      }
    });

    return await modal.present();
  }

}
