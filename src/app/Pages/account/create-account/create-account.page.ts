import { Component, OnInit } from '@angular/core';
import { EMPTY_STRING, FROM_MSIG } from 'src/environments/variable.const';
import { Account } from 'src/app/Interfaces/account';
import { makeShortAddress } from 'src/Helpers/converters';
import { AccountService } from 'src/app/Services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { AccountPopupPage } from '../account-popup/account-popup.page';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  addressValidator,
} from 'src/Helpers/validators';
import zoobc, { Address, getZBCAddress, MultiSigInfo } from 'zbc-sdk';
import { getTranslation } from 'src/Helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

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
  from = '';

  constructor(
    private activeRoute: ActivatedRoute,
    private navCtrl: NavController,
    private accountService: AccountService,
    private translate: TranslateService,
    private router: Router,
    private modalController: ModalController,
  ) { }

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
      this.formAccount.controls.accountName.setErrors({ accountNameExists });
    }

    if (this.formAccount.valid) {
      this.createAccount();
    }

  }

  async ngOnInit() {

    this.activeRoute.queryParams.subscribe(params => {
      this.from = params.from;
    });

    this.accounts = await this.accountService.allAccount('normal');
    const len = this.accounts.length + 1;
    this.accountName.setValue(`Account ${len}`);

    console.log('== from: ', this.from);
    if (this.from === 'msig') {
      this.changeToMultisig(true);
    }
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

    const pathNumber = await this.accountService.generateDerivationPath();

    let account: Account;

    if (!this.isMultisig) {
      account = this.accountService.createNewAccount(
        this.accountName.value.trim(),
        pathNumber
      );
      await this.accountService.addAccount(account);
      this.accountService.broadCastNewAccount(account);
      this.goListAccount();
      return;
    }

    const title = getTranslation('are you sure?', this.translate);
    const message = getTranslation(
      'once you create multisignature address, you will not be able to edit it anymore. but you can still delete it',
      this.translate
    );
    const buttonText = getTranslation('yes, continue it!', this.translate);
    Swal.fire({
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: buttonText,
      type: 'warning',
    }).then(res => {
      if (!res.value) { return null; }

      const participants = this.participants.value.filter(value => value.address && (value.address.address.length > 0));
      // participants = participants.sort();
      // console.log('=== participants: ', participants);
      // participants.forEach(this.filterPrticipant);

      const addresses: Address[] = participants.map(x => ({ value: x.address.address, type: 0 }));
      console.log('=== addresses: ', addresses);
      const multiParam: MultiSigInfo = {
        participants: addresses,
        nonce: this.nonce.value,
        minSigs: this.minimumSignature.value,
      };

      const multiSignAddress = zoobc.MultiSignature.createMultiSigAddress(multiParam);

      account = {
        name: this.accountName.value,
        type: 'multisig',
        path: null,
        nodeIP: null,
        address: { value: multiSignAddress, type: 0 },
        participants: addresses,
        nonce: this.nonce.value,
        minSig: this.minimumSignature.value,
      };
      console.log('==== create msig account: ', account);
      // this.accountService.addAccount(account);
      // this.accountService.broadCastNewAccount(account);

      if (this.from === FROM_MSIG) {
        this.accountService.addAccount(account, false);
        this.accountService.setTemp(account);
        this.navCtrl.pop();
        return;
      }

      this.accountService.addAccount(account);
      this.goListAccount();
      return;

    });

    // let addresses: [string] = this.participants.value.filter(value => value.length > 0);
    // addresses = addresses.sort();
    // const participants: Address[] = addresses.map(address => ({ value: address, type: 0 }));
    // const multiParam: MultiSigInfo = {
    //   participants,
    //   nonce: this.nonce.value,
    //   minSigs: this.minimumSignature.value,
    // };


    // account = this.accountService.createNewMultisigAccount(
    //   this.accountName.value.trim(),
    //   multiParam,
    // );



  }

  filterPrticipant(item) {
    const addrs = item.address;
    if (addrs) {
      console.log('=== addrs: ', addrs.address);
      const ad: Address = { value: addrs.address, type: 0 };

    }
  }

  goListAccount() {
    this.router.navigateByUrl('/list-account');
  }

  addParticipant() {
    this.participants.push(new FormGroup({
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
