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

import { Injectable } from '@angular/core';
import { ToastController, ModalController, AlertController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ConfirmationPage } from '../Components/confirmation/confirmation.page';
import { Router } from '@angular/router';
import { AccountService } from './account.service';
import { AddressBookService } from './address-book.service';

@Injectable({
  providedIn: 'root'
})

export class UtilService {

  constructor(
    private toastController: ToastController,
    private clipboard: Clipboard,
    private alertController: AlertController,
    private accService: AccountService,
    private abService: AddressBookService,
    private router: Router,
    private modalController: ModalController) { }

  public copyToClipboard(arg: any) {
    this.clipboard.copy(arg);
    this.clipboard.paste().then(
      () => {
        this.copySuccess();
      },
      () => {
        this.copyInBrowser(arg);
      }
    );
  }

  private copyInBrowser(arg: any) {
    const val = arg;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.copySuccess();
  }

  private async copySuccess() {
    const toast = await this.toastController.create({
      message: 'Copied to clipboard.',
      duration: 2000
    });

    toast.present();
  }

  /**
   * Confirmation page, if success set status = true otherwise false
   * @param title is title
   * @param msg is message
   * @param status is status
   * @param path is path
   */
  public async showConfirmation(title: string, msg: string, status: boolean, path?: string) {
    const modal = await this.modalController.create({
      component: ConfirmationPage,
      componentProps: {
        title,
        status,
        msg
      }
    });

    modal.onDidDismiss().then(() => {
      if (path) {
        this.router.navigateByUrl(path);
      }
    });

    return await modal.present();
  }

  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async MergeAccountAndContact() {
    this.accService.addresses = [];
    const accounts = await this.accService.allAccount();
    if (accounts && accounts.length > 0) {
      accounts.forEach((obj: any) => {
        const app = {
          name: obj.name,
          address: obj.address.value
        };
        this.accService.addresses.push(app);
      });
    }
    const alladdress = await this.abService.getAll();
    if (alladdress && alladdress.length > 0) {
      alladdress.forEach((obj: { name: any; address: string }) => {
        const app = {
          name: obj.name,
          address: obj.address
        };
        this.accService.addresses.push(app);
      });
    }
  }

}
