import { Component, OnInit } from '@angular/core';
import { MODE_EDIT, EMPTY_STRING, MODE_NEW } from 'src/environments/variable.const';
import { Account } from 'src/app/Interfaces/account';
import { makeShortAddress } from 'src/Helpers/converters';
import { AccountService } from 'src/app/Services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateAccountService } from 'src/app/Services/create-account.service';
import { sanitizeString } from 'src/Helpers/utils';
import zoobc, {MultiSigAddress} from 'zoobc-sdk';
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss']
})
export class CreateAccountPage implements OnInit {


  account: Account;
  accountName = EMPTY_STRING;
  mode = EMPTY_STRING;
  validationMessage = EMPTY_STRING;
  isNameValid = true;
  accounts: Account[];
  isMultisig: boolean;
  participants = ['', ''];
  signBy: string;
  nonce: number;
  minimumSignature: number;

  constructor(
    private createAccountService: CreateAccountService,
    private accountService: AccountService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
  //  this.participants = ['', ''];
  }


  async ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.mode = params.mode;
      this.account = JSON.parse(params.account);
      if (this.account) {
        this.accountName = this.account.name;
      }
    });

    if (this.mode === MODE_NEW) {
      const pathNumber = await this.accountService.generateDerivationPath();
      this.accountName = 'Account ' + (pathNumber + 1);
    }

    this.accounts = await this.accountService.allAccount();
  }

  public changeToMultisig() {
      console.log('=== is multisig: ', this.isMultisig);
  }

  async createOrUpdateAccount() {

    this.isNameValid = true;
    if (!this.accountName) {
      // console.log('== name is empty');
      this.validationMessage = 'Name is required';
      this.isNameValid = false;
      return;
    }

    if (this.mode === MODE_EDIT) {
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
    } else if (this.mode === MODE_NEW) {
      if (this.isNameExists(this.accountName)) {
        this.isNameValid = false;
        return;
      } else {
        await this.createAccount();
      }
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

    if (this.isMultisig) {
      // // let participants: [string] = this.participantsField.value.filter(value => value.length > 0);
      // this.participants = this.participants.sort();

      const multiParam: MultiSigAddress = {
        participants: this.participants,
        nonce: this.nonce,
        minSigs: this.minimumSignature
      };
      const multiSignAddress: string = zoobc.MultiSignature.createMultiSigAddress(multiParam);
      const pathNumber = await this.accountService.generateDerivationPath();
      const account = {
        name: this.accountName.trim(),
        type: 'multisig',
        path: pathNumber,
        nodeIP: null,
        address: multiSignAddress,
        participants: this.participants,
        nonce: this.nonce,
        minSig: this.minimumSignature,
        signByAddress: this.signBy,
      };
    } else {
      const pathNumber = await this.accountService.generateDerivationPath();
      const account = this.createAccountService.createNewAccount(this.accountName.trim(), pathNumber);
      this.accountService.addAccount(account);
      this.accountService.broadCastNewAccount(account);
    }
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

}
