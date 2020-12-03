import { Component, OnInit } from '@angular/core';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { NavController, AlertController } from '@ionic/angular';
import { Account } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
import { AuthService } from 'src/app/Services/auth-service';
@Component({
  selector: 'app-backuprestore-address',
  templateUrl: './backuprestore-address.page.html',
  styleUrls: ['./backuprestore-address.page.scss'],
})
export class BackuprestoreAddressPage implements OnInit {
  uid: string;
  accounts: Account[];
  addresses = [];
  addressName: string;
  addressAddress: string;
  isBackup = false;
  isRestore = false;
  isBackupFinish = false;
  isRestoreFinish = false;
  isAddressValid = true;
  isNameValid = true;
  validationMessage = '';
  numBerOfRestored = 0;
  counter = 0;

  constructor(
    private addressBookSrv: AddressBookService,
    private accountService: AccountService,
    private alertController: AlertController) { }

  ngOnInit() {
    this.getAllAddress();
    this.getAllAccounts();

  }

  async getAllAccounts() {
    this.accounts = await this.accountService.allAccount();
  }

  async getAllAddress() {
    this.addresses = await this.addressBookSrv.getAll();
  }

  backup() {
    if (!this.addresses || this.addresses.length < 1) {
      this.presentAlert();
      return;
    }

    this.isBackupFinish = false;
    this.isBackup = true;
    setTimeout(async () => {
      const mainAcc = this.accounts[0].address;
      this.createBackup(mainAcc, this.addresses);
      this.isBackup = false;
      this.isBackupFinish = true;
    }, 5000);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'No contact to backup!.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async createBackup(mainAcc: string, all: any) {
  }

  restore() {
    this.counter = 1;
    this.isRestore = true;
    this.isRestoreFinish = false;
    this.isRestore = false;
    this.isRestoreFinish = true;
  }

  isNameExists(name: string, address: string) {
    this.validationMessage = '';
    let finded = false;
    this.addresses.forEach(obj => {
      if (String(name).valueOf() === String(obj.name).valueOf() &&
        String(address).valueOf() !== String(obj.address).valueOf()) {
        this.validationMessage = 'Name is exist, with address: ' + obj.address ;
        finded = true;
      }
    });

    return finded;
  }


  isAddressExists(address: string) {
    this.validationMessage = '';
    let finded = false;

    this.addresses.forEach(obj => {
      if (String(address).valueOf() === String(obj.address).valueOf()) {
        this.validationMessage = 'Address is exist, with name: ' + obj.name;
        finded = true;
      }
    });
    return finded;
  }

}
