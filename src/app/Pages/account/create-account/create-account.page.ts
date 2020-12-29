import { Component, OnInit } from '@angular/core';
import { EMPTY_STRING } from 'src/environments/variable.const';
import { Account } from 'src/app/Interfaces/account';
import { makeShortAddress } from 'src/Helpers/converters';
import { AccountService } from 'src/app/Services/account.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AccountPopupPage } from '../account-popup/account-popup.page';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  addressValidator,
} from 'src/Helpers/validators';
import { Address, getZBCAddress, MultiSigInfo } from 'zbc-sdk';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss']
})
export class CreateAccountPage implements OnInit {
  scanForWhat: string;
  account: Account;
  validationMessage = EMPTY_STRING;
  nameErrorMessage = EMPTY_STRING;
  isNameValid = true;
  accounts: Account[];
  isMultisig: boolean;
  minimumParticipants = 2;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private modalController: ModalController,
  ) {}

  submitted = false;

  formAccount = new FormGroup({
    accountName: new FormControl('', [Validators.required]),
  });

  get accountName() {
    return this.formAccount.get('accountName');
  }

  get participants() {
    return this.formAccount.get('participants') as FormArray;
  }

  get nonce() {
    return this.formAccount.get('nonce');
  }

  get minimumSignature() {
    return this.formAccount.get('minimumSignature');
  }

  async submit() {
    this.submitted = true;
    const accountNameExists = this.isNameExists(this.accountName.value);

    if (accountNameExists) {
      this.formAccount.controls['accountName'].setErrors({ accountNameExists });
    }

    if (this.formAccount.valid) {
      this.createAccount();
    }
  }

  async ngOnInit() {
    this.accounts = await this.accountService.allAccount('normal');
    const len = this.accounts.length + 1;
    this.accountName.setValue(`Account ${len}`);
  }

  setMinimumSignatureValidation() {
    this.minimumSignature.setValidators([
      Validators.required,
      Validators.min(2),
      Validators.max(this.participants.controls.length)
    ]);

    this.minimumSignature.updateValueAndValidity();
  }

  async changeToMultisig(value: boolean) {
    this.isMultisig = value;

    if (value) {
      const formArray = new FormArray([]);

      formArray.push(
        new FormGroup({
          address: new FormControl('', [Validators.required, addressValidator]),
        })
      );
      formArray.push(
        new FormGroup({
          address: new FormControl('', [Validators.required, addressValidator]),
        })
      );

      this.formAccount.addControl('participants', formArray);
      this.formAccount.addControl('nonce', new FormControl('', [Validators.required, Validators.min(1)]));
      this.formAccount.addControl('minimumSignature', new FormControl(''));
      this.setMinimumSignatureValidation();

      this.accounts = await this.accountService.allAccount('multisig');
      let len = 1;
      if (this.accounts && this.accounts.length > 0) {
        len = this.accounts.length + 1;
      }
      this.accountName.setValue(`Multisig Account ${len}`);
    } else {
      this.formAccount.removeControl('participants');
      this.formAccount.removeControl('nonce');
      this.formAccount.removeControl('minimumSignature');
      this.accounts = await this.accountService.allAccount('normal');
      const len = this.accounts.length + 1;
      this.accountName.setValue(`Account ${len}`);
    }
  }

  isNameExists(accountName: string) {
    let address = '';
    if (
      this.accounts.findIndex(acc => {
        address = acc.address.value;
        return acc.name.trim().toLowerCase() === accountName.trim().toLowerCase();
      }) >= 0
    ) {
      return 'Name exists with address: ' + makeShortAddress(address);
    }

    return null;
  }

  async createAccount() {

    const keyring = this.accountService.keyring;
    const path = await this.accountService.generateDerivationPath();
    const childSeed = keyring.calcDerivationPath(path);
    const accountAddress = getZBCAddress(childSeed.publicKey);

    const pathNumber = await this.accountService.generateDerivationPath();

    let account: Account;

    if (!this.isMultisig) {
      account = this.accountService.createNewAccount(
        this.accountName.value.trim(),
        pathNumber
      );
    } else if (this.isMultisig) {

      let addresses: [string] = this.participants.value.filter(value => value.length > 0);
      addresses = addresses.sort();
      const participants: Address[] = addresses.map(address => ({ value: address, type: 0 }));
      const multiParam: MultiSigInfo = {
        participants,
        nonce: this.nonce.value,
        minSigs: this.minimumSignature.value,
      };


      account = this.accountService.createNewMultisigAccount(
        this.accountName.value.trim(),
        multiParam,
      );
    }

    await this.accountService.addAccount(account);
    this.accountService.broadCastNewAccount(account);
    this.goListAccount();
  }

  goListAccount() {
    this.router.navigateByUrl('/list-account');
  }

  addParticipant() {
    this.participants.push( new FormGroup({
      address: new FormControl('', [Validators.required, addressValidator]),
    }));
    this.setMinimumSignatureValidation();
  }

  removeParticipant(index: number) {
    this.participants.controls.splice(index, 1);
    this.setMinimumSignatureValidation();
  }

  async showPopupSignBy() {
    const modal = await this.modalController.create({
      component: AccountPopupPage
    });

    modal.onDidDismiss().then(dataReturned => {
      if (dataReturned.data) {
        // this.signByAccount = dataReturned.data;
      }
    });

    return await modal.present();
  }
}
