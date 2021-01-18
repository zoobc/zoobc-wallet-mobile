// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//             contact us at roberto.capodieci[at]blockchainzoo.com
//             and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  LoadingController,
  NavController
} from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/Services/auth-service';
import { SetupPinPage } from 'src/app/Pages/wallet/existing-wallet/setup-pin/setup-pin.page';
import { Location } from '@angular/common';
import { ZooKeyring } from 'zbc-sdk';
import { AccountService } from 'src/app/Services/account.service';
import { StorageService } from 'src/app/Services/storage.service';
import { STORAGE_ADDRESS_BOOK } from 'src/environments/variable.const';

@Component({
  selector: 'app-existing-wallet',
  templateUrl: './existing-wallet.page.html',
  styleUrls: ['./existing-wallet.page.scss']
})
export class ExistingWalletPage implements OnInit {
  plainPin: string;
  public passphrase: any;
  public errorMsg: string;
  private isValidPhrase: boolean;
  public wordCounter: number;
  public mnemonicWordLengtEnv: number = environment.mnemonicNumWords;
  public loginFail = false;
  private lang: string;
  public arrayPhrase = [];
  constructor(
    public loadingController: LoadingController,
    private navCtrl: NavController,
    private location: Location,
    private authSrv: AuthService,
    private modalController: ModalController,
    private accountSrv: AccountService,
    private storageSrv: StorageService
  ) {
    this.lang = 'english';
  }

  ngOnInit() {
    this.errorMsg = '';
    this.isValidPhrase = true;
    this.wordCounter = 0;
    this.resetForm();
  }

  resetForm() {
    for (let i = 0; i < 24; i++) {
      this.arrayPhrase[i] = '';
    }
  }

  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    const passphrase = clipboardData.getData('text').toLowerCase();
    const phraseWord = passphrase.trim().split(' ');

    setTimeout(() => {
      this.resetForm();
    }, 200);

    setTimeout(() => {
      this.arrayPhrase = phraseWord;
    }, 300);
  }

  openExistingWallet() {
    let haveEmpty = false;

    this.passphrase = '';
    for (let i = 0; i < this.arrayPhrase.length; i++) {
      const val = this.arrayPhrase[i].toLowerCase();
      if (!val) {
        haveEmpty = true;
        break;
      }
      this.passphrase += val;
      if (i < 23) {
        this.passphrase += ' ';
      }
    }

    if (haveEmpty) {
      this.errorMsg = 'Please fill in all field!';
      return;
    }

    this.isValidPhrase = ZooKeyring.isPassphraseValid(
      this.passphrase,
      this.lang
    );
    if (!this.isValidPhrase) {
      this.errorMsg = 'Passphrase is not valid';
      return;
    }

    this.accountSrv.setPlainPassphrase(this.passphrase);

    this.errorMsg = '';
    this.showPinDialog();
  }

  async createAccount() {
    await this.accountSrv.createInitialAccount();
    // this.storageSrv.remove(STORAGE_ADDRESS_BOOK);
    const loginStatus = this.authSrv.login(this.plainPin);
    if (loginStatus) {
      this.presentLoading();
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 2000,
      message: 'Please wait...',
      translucent: true
    });

    loading.onDidDismiss().then(() => {
      this.navCtrl.navigateRoot('/tabs/home');
    });

    return await loading.present();
  }

  async showPinDialog() {
    const pinmodal = await this.modalController.create({
      component: SetupPinPage,
      cssClass: 'modal-zbc',
      componentProps: {
      }
    });

    pinmodal.onDidDismiss().then(returnedData => {
      if (returnedData && returnedData.data !== '-') {
        this.plainPin = returnedData.data;
        this.accountSrv.setPlainPin(this.plainPin);
        this.accountSrv.willRestoreAccounts = true;
        this.createAccount();
      }
    });
    return await pinmodal.present();
  }

  goback() {
    this.location.back();
  }
}
