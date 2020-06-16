import { Component, OnInit } from '@angular/core';
import { EMPTY_STRING } from 'src/environments/variable.const';
import { Account } from 'src/app/Interfaces/account';
import { makeShortAddress } from 'src/Helpers/converters';
import { AccountService } from 'src/app/Services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { sanitizeString } from 'src/Helpers/utils';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.page.html',
  styleUrls: ['./edit-account.page.scss'],
})
export class EditAccountPage implements OnInit {


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
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
  }


  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.account = JSON.parse(params.account);
      if (this.account) {
        this.accountName = this.account.name;
      }
    });

    this.accountService.allAccount().then(allacc => {
      this.accounts = allacc;
    });
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

    if (this.accountName === this.account.name) {
      this.accountService.broadCastNewAccount(this.account);
      this.goListAccount();
      return;
    }

    // check if name exists
    if (this.isNameExists(this.accountName)) {
      this.validationMessage = 'Name is Exists';
      this.isNameValid = false;
      return;
    } else {
      this.accountService.updateNameByAddress(
        this.accountName.trim(), this.account
      );
      this.accountService.broadCastNewAccount(this.account);
      this.goListAccount();
      return;
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

}
