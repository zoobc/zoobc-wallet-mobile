import { Component, OnInit } from '@angular/core';
import { EMPTY_STRING, FOR_PARTICIPANT } from 'src/environments/variable.const';
import { Account } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
import { Router, NavigationExtras } from '@angular/router';
import { MultiSigAddress } from 'zoobc-sdk';
import { ModalController, AlertController } from '@ionic/angular';
import { AccountPopupPage } from '../account-popup/account-popup.page';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { QrScannerService } from 'src/app/Services/qr-scanner.service';
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss']
})
export class CreateAccountPage implements OnInit {
  scanForWhat: string;
  account: Account;
  accountName = EMPTY_STRING;
  validationMessage = EMPTY_STRING;
  nameErrorMessage = EMPTY_STRING;
  isNameValid = true;
  accounts: Account[];
  isMultisig: boolean;
  participants = ['', ''];
  signBy: string;
  signByAccount: Account;
  nonce: number;
  minimumSignature = 2;
  numOfParticipant = 2;
  indexSelected: number;
  fieldSource: string;
  isMinSigValid = true;
  isNonceValid = true;
  isParticipntValid = true;

  constructor(
    private accountService: AccountService,
    private addressbookService: AddressBookService,
    private router: Router,
    private modalController: ModalController,
    private qrScannerService: QrScannerService,
    private alertController: AlertController
  ) {

    this.addressbookService.participantSubject.subscribe({
      next: address => {
        this.participants[this.indexSelected] = address.address;
      }
    });

    this.qrScannerService.qrScannerSubject.subscribe(address => {
      this.getScannerResult(address);
    });
  }

  async ngOnInit() {
    this.accounts = await this.accountService.allAccount('normal');
    const len = this.accounts.length + 1;
    this.accountName = `Account ${len}`;
  }

  async getScannerResult(arg: string) {
    const result = arg.split('||');
    if (this.scanForWhat === FOR_PARTICIPANT) {
      this.participants[this.indexSelected] = result[0];
    }

  }

  validateNonce() {
    if (this.nonce <= 0) {
      this.isNonceValid = false;
    } else {
      this.isNonceValid = true;
    }
  }

  validateMinimumSig() {
    if (this.minimumSignature < 2 || this.minimumSignature > this.participants.length) {
      this.isMinSigValid = false;
    } else {
      this.isMinSigValid = true;
    }
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

  isFormValid() {
    this.isNameValid = true;
    if (this.accountName === undefined || !this.accountName) {
      this.nameErrorMessage = 'Name is required';
      this.isNameValid = false;
    }

    if (this.isNameExists(this.accountName)) {
      this.nameErrorMessage = 'Name already exists';
      this.isNameValid = false;
    }

    if (!this.isMultisig && !this.isNameValid) {
      return false;
    }

    // validate multisig
    if (this.isMultisig) {
      this.isMinSigValid = true;
      this.isNonceValid = true;
      this.isParticipntValid = true;
      console.log(' enter 1');
      this.participants.forEach((prc) => {
        if (prc === undefined || prc.trim() === '') {
          this.isParticipntValid = false;
        }
      });
      console.log(' enter 2');
      if (this.minimumSignature === undefined || this.minimumSignature > this.participants.length) {
        this.isMinSigValid = false;
      }
      console.log(' enter 3');
      if (this.nonce === undefined || this.nonce <= 0) {
        this.isNonceValid = false;
      }
      console.log(' enter 4');
      if (
        !this.isNonceValid
        || !this.isMinSigValid
        || !this.isNameValid
        || !this.isParticipntValid) {
        return false;
      }
      console.log(' enter 4');
      return true;
    } else {
      return true;
    }

  }

  isNameExists(name: string) {
    this.validationMessage = '';
    const isExists = this.accounts.find(acc => {
      if (name && acc.name.trim().toLowerCase() === name.trim().toLowerCase()) {
        this.validationMessage =
          'Name exists with address: ' + acc.address;
        return true;
      }
      return false;
    });
    return isExists;
  }

  sanitize() {
    this.accountName = (this.accountName);
  }

  changeParticipant() {
    if (this.numOfParticipant < 2) {
      this.numOfParticipant = 2;
      return;
    }

    for (let i = 2; i < this.numOfParticipant; i++) {
      this.participants.push('');
    }
  }

  async createAccount() {
    if (!this.isFormValid()) {
      return;
    }

    if (this.isMultisig && (this.isMinSigValid === false || this.isNonceValid === false)) {
      return;
    }

    const pathNumber = await this.accountService.generateDerivationPath();
    let account: Account = this.accountService.createNewAccount(
      this.accountName.trim(),
      pathNumber
    );

    if (this.isMultisig) {
      const multiParam: MultiSigAddress = {
        participants: this.participants,
        nonce: this.nonce,
        minSigs: this.minimumSignature
      };
      account = this.accountService.createNewMultisigAccount(
        this.accountName.trim(),
        multiParam,
        this.signByAccount
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
    this.participants.push('');
  }

  reduceParticipant() {
    const len = this.participants.length;
    if (len > 2) {
      this.participants.splice(len - 1, 1);
    }
  }

  customTrackBy(index: number): any {
    return index;
  }

  async openListAccount() {
    const modal = await this.modalController.create({
      cssClass: 'zbc-modal',
      component: AccountPopupPage,
      componentProps: {
        idx: this.indexSelected
      }
    });

    modal.onDidDismiss().then(dataReturned => {
      if (dataReturned.data) {
        if (this.fieldSource === 'participant') {
          this.participants[this.indexSelected] = dataReturned.data.address;
        }
      }
    });

    return await modal.present();
  }

  async showPopupSignBy() {
    const modal = await this.modalController.create({
      component: AccountPopupPage
    });

    modal.onDidDismiss().then(dataReturned => {
      if (dataReturned.data) {
        this.signByAccount = dataReturned.data;
        this.signBy = this.signByAccount.address;
      }
    });

    return await modal.present();
  }

  async presentGetAddressOption(source: string, index: number) {
    this.indexSelected = index;
    this.fieldSource = source;
    const alert = await this.alertController.create({
      header: 'Select Option',
      cssClass: 'alertCss',
      inputs: [
        {
          name: 'opsi1',
          type: 'radio',
          label: 'Scan QR Code',
          value: 'scan',
          checked: true
        },
        {
          name: 'opsi2',
          type: 'radio',
          label: 'Contacts',
          value: 'address'
        },
        {
          name: 'opsi3',
          type: 'radio',
          label: 'My Accounts',
          value: 'account'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // console.log('Confirm Cancel', val);
          }
        },
        {
          text: 'Ok',
          handler: val => {
            if (val === 'address') {
              this.openAddresses();
            } else if (val === 'account') {
              this.openListAccount();
            } else {
              this.scanQrCode();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  openAddresses() {
    const navigationExtras: NavigationExtras = {
      state: {
        forWhat: this.fieldSource
      }
    };

    this.router.navigate(['/address-book'], navigationExtras);
  }

  scanQrCode() {
    this.scanForWhat = this.fieldSource;
    this.router.navigateByUrl('/qr-scanner');
  }

}
