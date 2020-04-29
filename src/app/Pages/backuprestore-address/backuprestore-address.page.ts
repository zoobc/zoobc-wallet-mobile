import { Component, OnInit } from '@angular/core';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { AccountService } from 'src/app/Services/account.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-backuprestore-address',
  templateUrl: './backuprestore-address.page.html',
  styleUrls: ['./backuprestore-address.page.scss'],
})
export class BackuprestoreAddressPage implements OnInit {
  userEmail: string;
  emailAccounts: any;
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
    private navCtrl: NavController,
    private authService: AddressBookService) { }

  ngOnInit() {
    this.getAllAddress();
    if (this.authService.userDetails()) {
      this.userEmail = this.authService.userDetails().email;
      console.log('=== userEmail: ', this.userEmail);
    } else {
      this.navCtrl.navigateBack('/login-backup');
    }

  }

  logout() {
    this.authService.logoutUser()
    .then(res => {
      console.log(res);
      this.navCtrl.navigateBack('/login-backup');
    })
    .catch(error => {
      console.log(error);
    });
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
      const alladdress = await this.addressBookSrv.getAll();
      const mainAcc = this.userEmail;
      if (alladdress && alladdress.length > 0) {
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
    }).catch(error => {
        console.log(error);
      });
  }

  restore() {
    this.counter = 1;
    this.isRestore = true;
    this.isRestoreFinish = false;
    const mainAcc = this.userEmail;
    console.log('=== Main Email: ', mainAcc);
    this.addressBookSrv.restore_backup(mainAcc).then( doc => {
        if (doc.exists && doc.data().addresses) {
            const addresses = doc.data().addresses;
            this.addressBookSrv.insertBatch(addresses);
        }
      }).catch(error => {
        console.log('Error getting document:', error);
      });
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
