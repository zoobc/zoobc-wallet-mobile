import { Component, OnInit } from '@angular/core';
import { EMPTY_STRING } from 'src/environments/variable.const';
import { Account } from 'src/app/Interfaces/account';
import { makeShortAddress } from 'src/Helpers/converters';
import { AccountService } from 'src/app/Services/account.service';
import { Router } from '@angular/router';
import { sanitizeString } from 'src/Helpers/utils';
import {MultiSigAddress} from 'zoobc-sdk';
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
  nonce: number;
  minimumSignature: number;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    const pathNumber = await this.accountService.generateDerivationPath();
    this.accountName = 'Account ' + (pathNumber + 1);
    this.accounts = await this.accountService.allAccount();
  }

  public changeToMultisig() {
      console.log('=== is multisig: ', this.isMultisig);
      if (this.isMultisig) {
        // const len = this.authServ.getAllAccount('multisig').length + 1;
        // this.accountNameField.setValue(`Multisig Account ${len}`);
      }
  }

  async createOrUpdateAccount() {
    this.isNameValid = true;
    if (!this.accountName) {
      // console.log('== name is empty');
      this.validationMessage = 'Name is required';
      this.isNameValid = false;
      return;
    }
    if (this.isNameExists(this.accountName)) {
      this.isNameValid = false;
      return;
    } else {
      await this.createAccount();
    }

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
      account = this.accountService.createNewMultisigAccount(this.accountName.trim(), multiParam, this.signBy, pathNumber);
    }

    this.accountService.addAccount(account);
    this.accountService.broadCastNewAccount(account);
    this.goListAccount();
  }

  goListAccount() {
    this.router.navigateByUrl('/list-account');
  }

  addParticipant() {
    console.log('=== participants: ', this.participants);
    this.participants.push('');
  }

  removeParticipant(idx: number) {
    console.log('=== index: ', idx);
    if (idx > -1) {
      this.participants.splice(idx, 1);
    }
  }

  customTrackBy(index: number): any {
    return index;
  }

  showPopupAccount(index: number) {
    console.log('== index:', index);
  }
}
