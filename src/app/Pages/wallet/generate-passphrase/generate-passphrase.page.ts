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
import { Router } from '@angular/router';
import { UtilService } from 'src/app/Services/util.service';
import { ZooKeyring } from 'zbc-sdk';
import { AccountService } from 'src/app/Services/account.service';
import { NavController, Platform } from '@ionic/angular';
import { Languages } from 'src/app/Interfaces/language';

@Component({
  selector: 'app-generate-passphrase',
  templateUrl: './generate-passphrase.page.html',
  styleUrls: ['./generate-passphrase.page.scss']
})
export class GeneratePassphrasePage implements OnInit {


  constructor(
    private router: Router,
    private utilService: UtilService,
    private accountSrv: AccountService,
    private navCtrl: NavController,
    private platform: Platform
  ) {
  }
  writtenDown = false;
  terms = false;
  plainPassphrase: string;
  arrayPhrase = [];
  isPinSetup = false;
  pagePosition = 1;
  pageStep = 1;
  tempPin = '';
  loginFail = false;
  lang: string;
  backButtonSubscription: any;

  languages: Languages[] = [
    { value: 'chinese_simplified', viewValue: 'Chinese Simplified' },
    { value: 'english', viewValue: 'English' },
    { value: 'japanese', viewValue: 'Japanese' },
    { value: 'spanish', viewValue: 'Spanish' },
    { value: 'italian', viewValue: 'Italian' },
    { value: 'french', viewValue: 'French' },
    { value: 'korean', viewValue: 'Korean' },
    { value: 'chinese_traditional', viewValue: 'Chinese Traditional' },
  ];

  ngOnInit() {
    this.lang = 'english';
    this.generatePassphrase();
  }
  ionViewDidEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.backToInitial();
    });
  }

  ionViewWillLeave() {
    this.backButtonSubscription.unsubscribe();
  }

  backToInitial() {
    this.navCtrl.navigateBack('/initial');
  }

  onLanguageChanged(language: string) {
    this.generatePassphrase();
  }

  setupPin(event: any) {
    this.loginFail = false;
    const { first } = event;
    // set loginFail false && clear error message
    if (first === true) {
      return;
    }
    this.tempPin = event.pin;
    this.pagePosition++;
    this.pageStep++;
  }

  passphraseConfirmation() {
    this.accountSrv.setPlainPassphrase(this.plainPassphrase.slice());
    this.router.navigateByUrl('/create-wallet');
  }

  async generatePassphrase() {
    this.plainPassphrase = ZooKeyring.generateRandomPhrase(24, this.lang);
    if (this.lang === 'japanese') {
      this.arrayPhrase = this.plainPassphrase.slice().split(`${String.fromCharCode(12288)}`);
    } else {
      this.arrayPhrase = this.plainPassphrase.slice().split(' ');
    }
    this.accountSrv.setPlainPassphrase(this.plainPassphrase.slice());
    this.accountSrv.setArrayPassphrase(this.arrayPhrase);
  }

  private getPassphraseText() {
    const val = this.plainPassphrase.slice();
    // const arrayPass = val.split(' ');
    // let strCopy = 'This is your ZooBC passphrase:\n\n With order number\n-------------------------\n';
    // for (let i = 0; i < arrayPass.length; i++) {
    //   strCopy += (i + 1) + '.' + arrayPass[i];
    //   if (i < 23) {
    //     strCopy += ',   ';
    //   }
    //   if ((i + 1) % 3 === 0) {
    //     strCopy += '\n';
    //   }
    // }
    // strCopy += '\n\nWithout order number\n-------------------------\n' + val;
    // strCopy += '\n\n----------- End ----------\n\n';
    // return strCopy;
    return val;
  }

  copyToClipboard() {
    this.utilService.copyToClipboard(this.getPassphraseText());
  }

  ionViewDidLeave(): void {
    this.writtenDown = false;
    this.terms = false;
  }
}
