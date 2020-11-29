import { Component, OnInit } from '@angular/core';
import { EMPTY_STRING, FOR_PARTICIPANT } from 'src/environments/variable.const';
import { Account } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ModalController, AlertController, Platform } from '@ionic/angular';
import { AccountPopupPage } from '../account-popup/account-popup.page';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { QrScannerService } from 'src/app/Services/qr-scanner.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';
import { UtilService } from 'src/app/Services/util.service';

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
  accountJSON: string;
  mode: number;

  constructor(
    private accountService: AccountService,
    private activeRoute: ActivatedRoute,
    private addressbookService: AddressBookService,
    private androidPermissions: AndroidPermissions,
    private router: Router,
    private file: File,
    private utilService: UtilService,
    private platform: Platform,
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
    console.log('==== Node: ', this.mode);

    this.activeRoute.queryParams.subscribe(params => {
      this.account = JSON.parse(params.account);
      this.mode = params.mode;
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
    console.log('this mode: ', this.mode);
  }

  async loadMultisigAccount() {
    this.accounts = await this.accountService.allAccount('multisig');
    this.accountJSON = JSON.stringify(this.account);
    this.participants = this.account.participants; // .sort();
    this.signByAccount = await this.accountService.getAccount(this.account.signByAddress);
  }

  async loadNormalAccount() {
    this.accounts = await this.accountService.allAccount('normal');
  }

  copyToClipboard() {
    const theJSON = JSON.stringify(this.account);
    this.utilService.copyToClipboard(theJSON);
  }

  async ExportAccount() {

    const theJSON = JSON.stringify(this.account);
    const blob = new Blob([theJSON], { type: 'application/JSON' });
    const pathFile = await this.getDownloadPath();

    const fileName = this.getFileName(this.account.name);
    await this.file.createFile(pathFile, fileName, true);
    await this.file.writeFile(pathFile, fileName, blob, {
      replace: true,
      append: false
    });
    alert('File saved in Download folder with name: ' + fileName);

  }

  private getFileName(bame: string) {
    const currentDatetime = new Date();
    const formattedDate =
      currentDatetime.getDate() +
      '-' +
      (currentDatetime.getMonth() + 1) +
      '-' +
      currentDatetime.getFullYear() +
      '-' +
      currentDatetime.getHours() +
      '-' +
      currentDatetime.getMinutes() +
      '-' +
      currentDatetime.getSeconds();

    return 'Multisignature-info-' + name + formattedDate + '.json';
  }

  async getDownloadPath() {
    if (this.platform.is('ios')) {
      return this.file.documentsDirectory;
    }

    // To be able to save files on Android, we first need to ask the user for permission.
    // We do not let the download proceed until they grant access
    await this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      )
      .then(result => {
        if (!result.hasPermission) {
          return this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
          );
        }
      });

    return this.file.externalRootDirectory + '/Download/';
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

    this.account.name = sanitizeString(this.account.name);
    this.accountService.updateAccount(this.account);
    this.accountService.broadCastNewAccount(this.account);
    this.goListAccount();

  }

  isNameExists(name: string) {
    this.validationMessage = '';
    const isExists = this.accounts.find(acc => {
      if (name && acc.name.trim().toLowerCase() === name.trim().toLowerCase()) {
        this.validationMessage = 'Name exists with address: ' + acc.address;
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
