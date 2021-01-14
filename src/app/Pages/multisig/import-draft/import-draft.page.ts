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
import { AlertController, ModalController } from '@ionic/angular';
import { Account } from 'src/app/Interfaces/account';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { AccountService } from 'src/app/Services/account.service';
import { MultisigService } from 'src/app/Services/multisig.service';
import { UtilService } from 'src/app/Services/util.service';
import { isZBCAddressValid } from 'zbc-sdk';

@Component({
  selector: 'app-import-draft',
  templateUrl: './import-draft.page.html',
  styleUrls: ['./import-draft.page.scss'],
})
export class ImportDraftPage implements OnInit {
  account: Account;
  isMultiSignature: boolean;
  multiSigDrafts: MultiSigDraft[];

  constructor(private utilSrv: UtilService,
              private modalController: ModalController,
              private multisigServ: MultisigService,
              private accountSrv: AccountService,
              private alertController: AlertController) { }

  async ngOnInit() {
    await this.getMultiSigDraft();
    // this.goNextStep();
  }

  validationFile(file: any): file is MultiSigDraft {
    if ((file as MultiSigDraft).generatedSender !== undefined) {
      return isZBCAddressValid((file as MultiSigDraft).generatedSender);
    }
    return false;
  }

  public async uploadFile(files: FileList) {
    if (files && files.length > 0) {
      const file = files.item(0);
      const fileReader: FileReader = new FileReader();
      fileReader.readAsText(file, 'JSON');
      fileReader.onload = async () => {
        const fileResult = JSON.parse(fileReader.result.toString());
        const validation = this.validationFile(fileResult);
        if (!validation) {
          const message = 'You imported the wrong file';
          this.presentAlert('Opps...', message);
        } else {
          this.multisigServ.update(fileResult);
          const listdraft = await this.multisigServ.getDrafts();
          const checkExistDraft = listdraft.some(
            res => res.id === fileResult.id
          );

          if (checkExistDraft === true) {
            const message = 'There is same id in your draft';
            this.presentAlert('Opps...', message);
          } else {
            this.multisigServ.save();
            this.getMultiSigDraft();
            const subMessage = 'Your Draft has been saved';
            this.presentAlert('Success', subMessage);
          }
        }
      };
      fileReader.onerror = async err => {
        console.log(err);
        const message = 'An error occurred while processing your request';
        this.utilSrv.showConfirmation('Opps...', message, false, null);
      };
    }
  }

  async presentAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmation',
      subHeader: title,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }


  async getMultiSigDraft() {
    const currAccount = await this.accountSrv.getCurrAccount();
    this.account = currAccount;

    this.isMultiSignature = this.account.type !== 'multisig' ? false : true;

    const drafts = await this.multisigServ.getDrafts();
    console.log('=== Drfts: ', drafts);
    if (drafts) {
      this.multiSigDrafts = drafts;

    }
  }

  close() {
    this.modalController.dismiss(0);
  }
}
