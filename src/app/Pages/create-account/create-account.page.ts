import { Component, OnInit } from '@angular/core';
import { KeyringService } from '../../Services/keyring.service';
import { NavController, ModalController } from '@ionic/angular';
import { COIN_CODE } from 'src/environments/variable.const';
import { SavedAccount, AuthService } from 'src/app/Services/auth-service';
import { getAddressFromPublicKey } from 'src/Helpers/utils';
import { makeShortAddress } from 'src/Helpers/converters';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss']
})
export class CreateAccountPage implements OnInit {
  account: any;
  accountName: string;

  constructor(
    private keyringService: KeyringService,
    private authService: AuthService,
    private navCtrl: NavController,
    private modalController: ModalController
  ) {}

  ngOnInit() {

  }

  closeModal() {
    this.modalController.dismiss({
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

    this.authService.addAccount(account);
    this.navCtrl.pop();
  }
}
