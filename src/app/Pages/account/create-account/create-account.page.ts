import { Component, OnInit } from '@angular/core';
import { MODE_EDIT, EMPTY_STRING, MODE_NEW } from 'src/environments/variable.const';
import { Account } from 'src/app/Interfaces/account';
import { makeShortAddress } from 'src/Helpers/converters';
import { AccountService } from 'src/app/Services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateAccountService } from 'src/app/Services/create-account.service';
import { sanitizeString } from 'src/Helpers/utils';

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

  constructor(
    private createAccountService: CreateAccountService,
    private accountService: AccountService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }


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
        // TODO add toast
        return;
      }

      // check if name exists
      if (this.isNameExists(this.accountName)) {
        // console.log('== name exist: ', this.accountName);
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
        // console.log('== name exist: ', this.accountName);
        this.isNameValid = false;
        return;
      } else {
        await this.createAccount();
      }
    }
  }

  isNameExists(name: string) {
    // console.log('==== All accounts: ', this.accounts);
    // console.log('==== name: ', name);

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
    const account = this.createAccountService.createNewAccount(this.accountName.trim(), pathNumber);
    this.accountService.addAccount(account);
    this.accountService.broadCastNewAccount(account);
    this.goListAccount();
  }

  goListAccount() {
    this.router.navigateByUrl('/list-account');
  }

}
