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
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth-service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/Services/theme.service';
import { DEFAULT_THEME } from 'src/environments/variable.const';
import { AccountService } from 'src/app/Services/account.service';
import { NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  private start = 0;
  public pin = '';
  public pin2 = [];
  currentAccount: any;

  public isLoginValid = true;
  theme = DEFAULT_THEME;
  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router,
    private loadingController: LoadingController,
    private themeSrv: ThemeService,
    private navCtrl: NavController
  ) {
    // if theme changed
    this.themeSrv.themeSubject.subscribe(() => {
      this.theme = this.themeSrv.theme;
    });
  }


  initialPin() {
    this.start = 0;
    this.pin = '';
    this.pin2[0] = '_';
    this.pin2[1] = '_';
    this.pin2[2] = '_';
    this.pin2[3] = '_';
    this.pin2[4] = '_';
    this.pin2[5] = '_';
  }

  clear() {
    this.initialPin();
  }

  clearOne() {
    if (this.start > 0) {
      this.start--;
    }
    this.pin2[this.start] = '_';

    let l = this.pin.length;
    if (l > 0) {
      l = l - 1;
    }
    this.pin = this.pin.substring(0, l);
  }

  ionViewDidEnter() {
    this.theme = this.themeSrv.theme;
    if (!this.theme || this.theme === '' || this.theme === undefined) {
      this.theme = DEFAULT_THEME;
    }
  }

  async ngOnInit() {

    this.initialPin();
    this.theme = this.themeSrv.theme;
    if (!this.theme || this.theme === '' || this.theme === undefined) {
      this.theme = DEFAULT_THEME;
    }
    this.currentAccount = await this.accountService.getCurrAccount();

    if (this.currentAccount === null) {
      this.router.navigate(['initial']);
      return;
    }

    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      this.navCtrl.navigateRoot('/tabs/home');
    }
  }

  handleInput(bar: any) {
    if (this.pin.length === 6) {
      return;
    }

    this.pin += bar;
    this.pin2[this.start] = '*';

    if (this.pin.length === 6) {
     // setTimeout(() => {
      this.login(this.pin);
      // }, 200);

      setTimeout(() => {
        this.initialPin();
      }, 1800);
      return;

    }
    this.start++;

  }

  async login(pin: string) {
    const loading = await this.loadingController.create({
      message: 'Loading ...',
      duration: 3000
    });
    await loading.present();

    // const { pin } = e;
    this.isLoginValid = true;
    // const loginTp = this.authService.accWithPrivateKey;
   
    let isUserLoggedIn = false;
    if (this.currentAccount.type === 'privateKey' ) {
      console.log('=== this.currentAccount.privateKey: ', this.currentAccount.type);

      // this.authService.accWithPrivateKey = true;
      isUserLoggedIn = await this.authService.loginWithPK(pin);
    } else if (this.currentAccount.type === 'address') {
      console.log('=== this.currentAccount.address: ', this.currentAccount.type);

      // this.authService.accWithAddress = true;
      isUserLoggedIn = await this.authService.loginWithAddress(pin);
    } else {
      // this.authService.accWithPrivateKey = false;
      // this.authService.accWithAddress = false;
      isUserLoggedIn = await this.authService.login(pin);
    }

    if (isUserLoggedIn) {
      this.navCtrl.navigateRoot('/tabs/home');
    } else {
      this.isLoginValid = false;
      setTimeout(() => {
        this.isLoginValid = true;
      }, 1500);
    }

    await loading.dismiss();
  }
}
