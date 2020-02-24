import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { KeyringService } from 'src/app/Services/keyring.service';
import { AccountService } from 'src/app/Services/account.service';
import { COIN_CODE } from 'src/environments/variable.const';
import { AuthService, SavedAccount } from 'src/app/Services/auth-service';
import { getAddressFromPublicKey } from 'src/Helpers/utils';
import { makeShortAddress } from 'src/Helpers/converters';

@Component({
  selector: 'app-modal-create-account',
  templateUrl: './modal-create-account.component.html',
  styleUrls: ['./modal-create-account.component.scss']
})
export class ModalCreateAccountComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private accountService: AccountService,
    private authService: AuthService,
    private keyringService: KeyringService
  ) { }

  //  address: string;
  mode: string;
  index: number;
  validationMessage = '';

  account: any;
  accountName: string;
  accounts = [];
  isNameValid = true;

  ngOnInit() {

  }

  closeModal() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }


  async createAccount() {

    const path = this.authService.generateDerivationPath();
    const childSeed = this.keyringService.calcForDerivationPathForCoin(
      COIN_CODE,
      path
    );

    const accountAddress = getAddressFromPublicKey(childSeed.publicKey);
    const account: SavedAccount = {
      name: this.accountName,
      path,
      nodeIP: null,
      address: accountAddress,
      shortAddress: makeShortAddress(accountAddress)
    };

    this.account = account;
    this.authService.addAccount(account);

  }

  isNameExists(name: string) {

    console.log('==== All accounts: ', this.accounts);
    console.log('==== name: ', name);

    this.validationMessage = '';
    const finded = false;
    let i = 0;
    this.accounts.forEach(obj => {
      console.log('Obj name ===== ' + obj.accountName);

      if (String(name).valueOf() === String(obj.accountName).valueOf()) {
        console.log('obj ===== ' + obj);

      //  const address = this.accountService.getAccountAddress(obj);
      //  console.log('Name exizt ===== ' + address);

        // this.validationMessage = '<p>Name is exist, with address:<br/>' + address + '</p>';
        // if (this.mode === 'edit') {
        //   if (i !== this.index) {
        //     finded = true;
        //   }
        // } else {
        //   finded = true;
        // }
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
        console.log('----- enter to edit mode');
        await this.accountService.updateNameByIndex(
          this.accountName,
          this.index
        );
      } else {
        await this.createAccount();
      }

      this.modalCtrl.dismiss({
        // == put here return value
      });

    }

  }
}
