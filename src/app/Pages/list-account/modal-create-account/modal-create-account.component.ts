import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { KeyringService } from 'src/app/Services/keyring.service';
import { AccountService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-modal-create-account',
  templateUrl: './modal-create-account.component.html',
  styleUrls: ['./modal-create-account.component.scss']
})
export class ModalCreateAccountComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private accountService: AccountService,
    private storage: Storage,
    private keyringService: KeyringService
  ) { }

  address: string;
  mode: string;
  index: number;
  validationMessage = '';

  account: any;
  accountName: string;
  accounts = [];
  isNameValid = true;

  coinCode = 'ZBC - Zoobc';

  ngOnInit() {
    this.getAllAccount();
  }

  closeModal() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  async generateAccount() {
    const passphrase = await this.storage.get('passphrase');
    const accounts = await this.storage.get('accounts');

    const { bip32RootKey } = this.keyringService.calcBip32RootKeyFromSeed(
      this.coinCode,
      passphrase,
      null
    );

    this.account = this.keyringService.calcForDerivationPathForCoin(
      this.coinCode,
      accounts.length,
      0,
      bip32RootKey
    );
  }

  async getAllAccount() {
     const allAccounts = await this.accountService.getAll();
     if (allAccounts) {
       this.accounts = allAccounts;
    }
  }

  isNameExists(name: string) {

    console.log('==== All accounts: ', this.accounts);
    console.log('==== name: ', name);

    this.validationMessage = '';
    let finded = false;
    let i = 0;
    this.accounts.forEach(obj => {
      console.log('Obj name ===== ' + obj.accountName);

      if (String(name).valueOf() === String(obj.accountName).valueOf()) {
        console.log('obj ===== ' +  obj);

        const address  = this.accountService.getAccountAddress(obj);
        console.log('Name exizt ===== ' +  address);

        this.validationMessage = '<p>Name is exist, with address:<br/>' + address + '</p>';
        if (this.mode === 'edit') {
          if (i !== this.index) {
            finded = true;
          }
        } else {
          finded = true;
        }
      }
      i++;
    });

    return finded;
  }

  async createOrUpdateAccount() {

    this.isNameValid = true;

    if (!this.accountName) {
      console.log('== name is empty');
      this.validationMessage = 'Name is empty';
      this.isNameValid = false;
      return;
    }

    if (this.isNameExists(this.accountName)) {
      console.log('== name exist: ', this.accountName);
      this.isNameValid = false;
      return;
    }

    if (this.isNameValid) {

       if (this.mode === 'edit') {
        console.log("----- enter to edit mode");
        await this.accountService.updateNameByIndex(
           this.accountName,
           this.index
         );
       } else {
        console.log('----- enter to Add mode');
        console.log('==== All Accounts: ', this.accounts);

        await this.generateAccount();

        console.log('=== after created: ', this.account);

        const acc = {
           accountName: this.accountName,
           accountProps: this.account,
           created: new Date()
         };

        console.log(' accoiunt will created: ', acc);

        await this.accountService.update([...this.accounts, acc]);
      }

       this.modalCtrl.dismiss({
         // == put here return value
      });

    }

  }
}
