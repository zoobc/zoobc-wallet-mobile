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
import { AuthService } from 'src/app/Services/auth-service';
import {
  DEFAULT_THEME,
  STORAGE_ADDRESS_BOOK
} from 'src/environments/variable.const';
import { ThemeService } from 'src/app/Services/theme.service';
import { AccountService } from 'src/app/Services/account.service';
import { ModalController, NavController } from '@ionic/angular';
import { StorageService } from 'src/app/Services/storage.service';

@Component({
  selector: 'app-setup-pin-gp',
  templateUrl: './setup-pin-gp.page.html',
  styleUrls: ['./setup-pin-gp.page.scss']
})
export class SetupPinGpPage implements OnInit {
  public tempPin: string;
  public isLoginValid = true;
  public loginFail = false;
  public pagePosition: number;
  public plainPassphrase: any;
  public processing = false;
  public theme = DEFAULT_THEME;

  constructor(
    private accountSrv: AccountService,
    private authSrv: AuthService,
    private navCtrl: NavController,
    private themeSrv: ThemeService,
    private modalCtrl: ModalController,
    private storageSrv: StorageService
  ) {
    this.pagePosition = 0;
    this.processing = false;
    // if theme changed
    this.themeSrv.themeSubject.subscribe(() => {
      this.theme = this.themeSrv.theme;
    });
  }

  ngOnInit() {
    this.plainPassphrase = this.accountSrv.getPassphrase();
    this.theme = this.themeSrv.theme;
    if (!this.theme) {
      this.theme = DEFAULT_THEME;
    }
  }

  ionViewDidEnter() {
    this.theme = this.themeSrv.theme;
    if (!this.theme || this.theme === '' || this.theme === undefined) {
      this.theme = DEFAULT_THEME;
    }
  }

  async confirmPin(event: any) {
    const { pin } = event;
    this.loginFail = false;
    this.processing = true;
    // const pin = event.pin;
    if (this.tempPin === pin) {
      this.accountSrv.setPlainPassphrase(this.plainPassphrase);
      this.accountSrv.setPlainPin(pin);
      await this.accountSrv.createInitialAccount();
      this.storageSrv.remove(STORAGE_ADDRESS_BOOK);
      const loginStatus = await this.authSrv.login(pin);
      if (loginStatus) {
        setTimeout(() => {
          this.navCtrl.navigateRoot('/tabs/home');
          this.processing = false;
        }, 100);
      }
    } else {
      this.loginFail = true;
      setTimeout(() => {
        this.loginFail = false;
        this.processing = false;
      }, 1500);
    }
  }

  setupPin(event: any) {
    this.loginFail = false;
    this.tempPin = event.pin;
    this.processing = true;
    setTimeout(() => {
      this.pagePosition++;
      this.processing = false;
    }, 1500);
  }

  async cancel() {
    await this.modalCtrl.dismiss('-');
  }
}
