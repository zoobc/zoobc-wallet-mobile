import { Component, OnInit } from '@angular/core';
import { EMPTY_STRING, FOR_PARTICIPANT } from 'src/environments/variable.const';
import { Account } from 'src/app/Interfaces/account';
import { makeShortAddress } from 'src/Helpers/converters';
import { AccountService } from 'src/app/Services/account.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { sanitizeString } from 'src/Helpers/utils';
import { ModalController, AlertController } from '@ionic/angular';
import { AccountPopupPage } from '../account-popup/account-popup.page';
import { MultiSigAddress } from 'zoobc-sdk';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { QrScannerService } from 'src/app/Services/qr-scanner.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.page.html',
  styleUrls: ['./edit-account.page.scss'],
})
export class EditAccountPage implements OnInit {
  scanForWhat: string;
  account: Account;
  validationMessage = EMPTY_STRING;
  accountName = EMPTY_STRING;
  isNameValid = true;
  accounts: Account[];
  signBy: string;
  signByAccount: Account;
  oldName: string;
  participants = ['', ''];
  indexSelected: number;
  fieldSource: string;
  isMinSigValid = true;
  isNonceValid = true;
  isParticipntValid = true;
  isMultisig: boolean;
  minimumSignature: number;
  nonce: number;
  nameErrorMessage = EMPTY_STRING;

  constructor(
    private accountService: AccountService,
    private activeRoute: ActivatedRoute,
    private addressbookService: AddressBookService,
    private router: Router,
    private qrScannerService: QrScannerService,
    private alertController: AlertController,
    private modalController: ModalController
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

  async getScannerResult(arg: string) {
    const result = arg.split('||');
    if (this.scanForWhat === FOR_PARTICIPANT) {
      this.participants[this.indexSelected] = result[0];
    }
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.account = JSON.parse(params.account);
      if (this.account) {
        this.oldName = this.account.name;
      }
    });

    if (this.account && this.account.type === 'multisig') {
      this.isMultisig = true;
      this.loadMultisigAccount();
    } else {
      this.isMultisig = false;
      this.loadNormalAccount();
    }
  }

  async loadMultisigAccount() {
    this.accounts = await this.accountService.allAccount('multisig');
    this.participants = this.account.participants; // .sort();
    this.signByAccount = await this.accountService.getAccount(this.account.signByAddress);
    this.signBy = this.signByAccount.address;
  }

  async loadNormalAccount() {
    this.accounts = await this.accountService.allAccount('normal');
  }

  ExportAccount() {

  }

  async UpdateAccount() {

    this.isNameValid = true;
    if (this.oldName === this.account.name) {
      this.accountService.broadCastNewAccount(this.account);
      this.goListAccount();
      return;
    }

    if (!this.account.name) {
      this.validationMessage = 'Name is required';
      this.isNameValid = false;
      return;
    }

    if (this.oldName !== this.account.name && this.isNameExists(this.account.name)) {
      this.validationMessage = 'Name is Exists';
      this.isNameValid = false;
      return;
    }

    // // const pathNumber = await this.accountService.generateDerivationPath();
    // // let account: Account = this.accountService.createNewAccount(
    // //   this.accountName.trim(),
    // //   pathNumber
    // // );

    // if (this.isMultisig) {
    //   // this.participants = this.participants.sort();
    //   const multiParam: MultiSigAddress = {
    //     participants: this.participants,
    //     nonce: this.nonce,
    //     minSigs: this.minimumSignature
    //   };
    //   account = this.accountService.createNewMultisigAccount(
    //     this.accountName.trim(),
    //     multiParam,
    //     this.signByAccount
    //   );
    // }

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

  openAddresses() {
    const navigationExtras: NavigationExtras = {
      state: {
        forWhat: this.fieldSource
      }
    };

    this.router.navigate(['/address-book'], navigationExtras);
  }

  async showPopupSignBy() {
    const modal = await this.modalController.create({
      component: AccountPopupPage
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.signByAccount =  dataReturned.data;
        this.signBy = this.signByAccount.address;
        this.account.signByAddress = this.signByAccount.address;
      }
    });

    return await modal.present();
  }

  scanQrCode() {
    this.scanForWhat = this.fieldSource;
    this.router.navigateByUrl('/qr-scanner');
  }

}
