import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/Services/auth-service';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { AccountService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-backuprestore-address',
  templateUrl: './backuprestore-address.page.html',
  styleUrls: ['./backuprestore-address.page.scss'],
})
export class BackuprestoreAddressPage implements OnInit {
  accounts: Account[];

  addresses: any;
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
    private accountService: AccountService) { }

  ngOnInit() {
    this.getAllAddress();
  }


  async getAllAddress() {
    const alladdress = await this.addressBookSrv.getAll();
    if (alladdress) {
      this.addresses = alladdress;
    }
  }

  async backup() {
    this.isBackupFinish = false;
    this.isBackup = true;
    setTimeout(async () => {

      console.log('.... backup ....');
      const alladdress = await this.addressBookSrv.getAll();
      this.accounts = await this.accountService.getAllAccount();

      console.log('All Address: ', alladdress);

      const mainAcc = this.accounts[0].address;
      console.log('--- main Acc: ', mainAcc);
      if (alladdress && alladdress.length > 0) {

        // save to firebase
        this.createBackup(mainAcc, alladdress);


      }
      this.isBackup = false;
      this.isBackupFinish = true;
    }, 5000);
  }

  async createBackup(mainAcc: string, all: any) {

    const obj = { id: mainAcc, addresses: all };
    await this.addressBookSrv.create_backup(mainAcc, obj).then(resp => {
      console.log(resp);
    })
      .catch(error => {
        console.log(error);
      });
  }

  async restore() {
    this.counter = 1;
    this.isRestore = true;
    this.isRestoreFinish = false;
    setTimeout(async () => {

      console.log('.... restore ....');
      this.accounts = await this.accountService.getAllAccount();
      const mainAcc = this.accounts[0].address;
      this.addressBookSrv.restore_backup(mainAcc).then(async doc => {
        if (doc.exists) {
          if (doc.data().addresses) {
            this.numBerOfRestored = doc.data().addresses.length;
            // await this.addressBookSrv.insertBatch(doc.data().addresses);
            this.restoreAddress(doc.data().addresses);
          }
        }
      }).catch(error => {
        console.log('Error getting document:', error);
      });
      this.isRestore = false;
      this.isRestoreFinish = true;
    }, 1000);
  }

  async restoreAddress(addresses: any) {
    this.numBerOfRestored = addresses.length;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < addresses.length; i++) {

      // console.log('number restore: ' + i, this.counter);

      // console.log('-- Address: ', dt.address);
      // console.log('-- Name: ', dt.name);
      // console.log('-- Created: ', dt.created);
      const dt  = addresses[i];
      setTimeout(async () => {
        this.counter = i + 1;
       // console.log('will iunsert: ' + (i + 1), dt);
        await this.saveAddress(dt.name, dt.address, dt.created);
        // this.counter += 1;
      }, 2000);

    }
    // addresses.forEach(async dt => {

    // });
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


  async saveAddress(name: string, address: string, created: any) {
    this.isAddressValid = true;
    this.isNameValid = true;
    let nName  = name;
    if (this.isNameExists(name, address)) {
       nName = name + '-2';
    }

    if (this.isAddressExists(address)) {
        this.isAddressValid = false;
    }

    if (this.isAddressValid && this.isNameValid) {
       console.log('will insert : ', nName);
       await this.addressBookSrv.insert(
          nName,
          address,
          created
        );
    }

    return true;

  }

}
