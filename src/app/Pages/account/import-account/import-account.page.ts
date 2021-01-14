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
import { Account } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-import-account',
  templateUrl: './import-account.page.html',
  styleUrls: ['./import-account.page.scss'],
})
export class ImportAccountPage implements OnInit {
  multisifInfo: string;
  constructor(
    private accountService: AccountService,
    private modalController: ModalController) { }

  ngOnInit() {
  }

  async importText() {
    const fileResult = JSON.parse(this.multisifInfo);
    if (!this.isSavedAccount(fileResult)) {
      alert('You imported the wrong file');
      return;
    }

    const accountSave: Account = fileResult;
    console.log('== accountSave: ', accountSave);

    const allAcc  = await this.accountService.allAccount('multisig');
    const idx = allAcc.findIndex(acc => acc.address === accountSave.address);
    if (idx >= 0) {
      alert('Account with that address is already exist');
      return;
    }

    try {
      await this.accountService.addAccount(accountSave).then(() => {
          this.close(1);
      });
    } catch {
      alert ('Error when importing account, please try again later!');
    } finally {
    }

  }

  async close(status: number) {
    await this.modalController.dismiss(status);
  }

  public uploadFile(files: FileList) {
    if (files==null) {
      return null;
    }

    if (files && files.length > 0) {
      const file = files.item(0);
      const fileReader: FileReader = new FileReader();
      fileReader.readAsText(file, 'JSON');
      fileReader.onload = async () => {
        let fileResult;
        try {
          fileResult = JSON.parse(fileReader.result.toString());
        } catch {
          alert('File not compatible1');
          return;
        }
        if (!this.isSavedAccount(fileResult)) {
          alert('You imported the wrong file');
          return;
        }
        const accountSave: Account = fileResult;
        console.log('== accountSave: ', accountSave);

        const allAcc  = await this.accountService.allAccount('multisig');
        const idx = allAcc.findIndex(acc => acc.address === accountSave.address);
        if (idx >= 0) {
          alert('Account with that address is already exist');
          return;
        }

        try {
          await this.accountService.addAccount(accountSave).then(() => {
              this.close(1);
          });
        } catch {
          alert ('Error when importing account, please try again later!');
        } finally {
        }
      };
    }
  }

  isSavedAccount(obj: any): obj is Account {
    if ((obj as Account).type) { return true; }
    return false;
  }

}
