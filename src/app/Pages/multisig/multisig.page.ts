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
import { Router } from '@angular/router';
import { MultisigService } from 'src/app/Services/multisig.service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { AlertController, ModalController, Platform, PopoverController } from '@ionic/angular';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Interfaces/account';
import { TransactionType } from 'zbc-sdk';
import { ImportDraftPage } from './import-draft/import-draft.page';
import { THEME_OPTIONS } from 'src/environments/variable.const';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { getTxType } from 'src/Helpers/multisig-utils';
import { getFileName, getTranslation } from 'src/Helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { PopoverOptionComponent } from 'src/app/Components/popover-option/popover-option.component';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-multisig',
  templateUrl: './multisig.page.html',
  styleUrls: ['./multisig.page.scss']
})
export class MultisigPage implements OnInit {

  txType = [
    { code: TransactionType.SENDMONEYTRANSACTION, type: 'Transfer ZBC' },
    { code: TransactionType.SETUPACCOUNTDATASETTRANSACTION, type: 'setup account dataset' },
    { code: TransactionType.REMOVEACCOUNTDATASETTRANSACTION, type: 'remove account dataset' },
    { code: TransactionType.APPROVALESCROWTRANSACTION, type: 'escrow approval' },
  ];

  account: Account;
  multisigForm: FormGroup;
  drafts: MultiSigDraft[];
  fTrxType = new FormControl(TransactionType.SENDMONEYTRANSACTION, Validators.required);
  fChainType = new FormControl('onchain', Validators.required);
  themes = THEME_OPTIONS;
  isAccMultisig = false;
  innerTransaction = false;
  draftTxType: string[] = [];
  signatures = false;
  draftSignedBy: number[] = [];
  isShowForm = false;
  idx: number;
  textDelete = 'Delete';
  textShare = 'Share-draft';
  textSignatureList = 'Signature-list';

  constructor(
    private router: Router,
    private accountService: AccountService,
    private alertController: AlertController,
    private multisigServ: MultisigService,
    private modalController: ModalController,
    private androidPermissions: AndroidPermissions,
    private translate: TranslateService,
    private file: File,
    private platform: Platform,
    private popoverCtrl: PopoverController,
    private formBuilder: FormBuilder) {

    this.multisigForm = this.formBuilder.group({
      trxType: this.fTrxType,
      chainType: this.fChainType
    });

    this.multisigServ.subject.subscribe((info) => {
      console.log('== action:', info);
      this.getDraft();
    });

  }

  showForm() {
    this.isShowForm = true;
  }

  async ngOnInit() {
    this.getAccountType();
    this.getDraft();
  }


  async getAccountType() {
    this.account = await this.accountService.getCurrAccount();
    this.isAccMultisig = this.account.type === 'multisig' ? true : false;
  }

  async next() {

    const txType = this.fTrxType.value;
    const multisig: MultiSigDraft = {
      accountAddress: null,
      fee: 0,
      id: 0,
      multisigInfo: null,
      unisgnedTransactions: null,
      signaturesInfo: null,
      txType,
      txBody: {},
    };

    if (this.isAccMultisig) {
      const accounts = (await this.accountService
        .allAccount())
        .filter(acc => this.account.participants.some(address => address.value === acc.address.value));

      // if no address on the participants
      if (accounts.length < 1) {
        const message = getTranslation('you dont have any account that in participant list', this.translate);
        Swal.fire({ type: 'error', title: 'Oops...', text: message });
        return false;
      }

      multisig.multisigInfo = {
        minSigs: this.account.minSig,
        nonce: this.account.nonce,
        participants: this.account.participants,
      };

      multisig.txBody.sender = this.account.address;
      console.log('... this.multisig:', multisig);

      this.multisigServ.update(multisig);
      this.router.navigate(['/msig-create-transaction']);
    } else {
      this.multisigServ.update(multisig);
      this.router.navigate(['/msig-add-info']);
    }
  }


  detail(draft: MultiSigDraft) {
    console.log('=== detail: ', draft);
    this.multisigServ.update(draft);
    this.router.navigate(['/msig-detail']);
  }

  async showOption(ev: any, index: number, draft: MultiSigDraft) {

    this.idx = index;
    const popoverOptions = [
      {
        key: 'share',
        label: this.textShare
      },
      {
        key: 'delete',
        label: this.textDelete
      }
      ,
      {
        key: 'list',
        label: this.textSignatureList
      }
    ];

    const popover = await this.popoverCtrl.create({
      component: PopoverOptionComponent,
      componentProps: {
        options: popoverOptions
      },
      event: ev,
      translucent: true
    });

    popover.onWillDismiss().then(({ data: action }) => {
      switch (action) {
        case 'share':
          this.export(ev, draft);
          break;
        case 'delete':
          this.delete(ev, draft.id);
          break;
        case 'list':
          this.signlist(ev, draft);
          break;
      }
    });

    return popover.present();
  }

  signlist(ev, draft: MultiSigDraft) {
    ev.stopPropagation();
    this.multisigServ.update(draft);
    this.router.navigate(['/msig-add-signatures']);
  }

  async getDraft() {
    this.drafts = await this.multisigServ.getDrafts();
    console.log('== this.drafts : ', this.drafts);

    if (!this.drafts || this.drafts.length < 1) {
      return;
    }

    this.drafts = this.drafts.sort().reverse();

    this.drafts.forEach((draft, i) => {
      let total = 0;
      if (draft.signaturesInfo) {
        draft.signaturesInfo.participants.forEach(p => {
          total += Buffer.from(p.signature).length > 0 ? 1 : 0;
        });
      }
      this.draftSignedBy[i] = total;
      this.draftTxType[i] = getTxType(draft.txType);
    });
  }

  async import() {
    const importDraft = await this.modalController.create({
      component: ImportDraftPage,
      componentProps: {}
    });

    importDraft.onDidDismiss().then(returnedData => {
      console.log('=== returneddata: ', returnedData);
      if (returnedData && returnedData.data !== 0) {
        alert('Draft has been successfully imported');
      }
    });
    return await importDraft.present();
  }


  async delete(e, id: number) {
    e.stopPropagation();
    const sentence = getTranslation('are you sure want to delete?', this.translate, {
      alias: id,
    });
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: sentence,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        },
        {
          text: 'Oke',
          handler: async () => {
            console.log('idx: ', id);
            await this.multisigServ.delete(id);
            return true;
          }
        }
      ]
    });
    await alert.present();

  }



  async signatureList(ect: any, id: number) {
    console.log('== signatureList ==');
  }

  export2(e, draft: MultiSigDraft) {
    e.stopPropagation();
    const theJSON = JSON.stringify(draft);
    const blob = new Blob([theJSON], { type: 'application/JSON' });
    saveAs(blob, 'Multisignature-Draft.json');
  }


  async export(e, draft: MultiSigDraft) {
    e.stopPropagation();

    const theJSON = JSON.stringify(draft);
    const blob = new Blob([theJSON], { type: 'application/JSON' });
    const pathFile = await this.getDownloadPath();

    const fileName = getFileName('Multisignature-draft');
    await this.file.createFile(pathFile, fileName, true);
    await this.file.writeFile(pathFile, fileName, blob, {
      replace: true,
      append: false
    });
    alert('File saved in Download folder with name: ' + fileName);

  }

  async getDownloadPath() {
    if (this.platform.is('ios')) {
      return this.file.documentsDirectory;
    }

    await this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      )
      .then(result => {
        if (!result.hasPermission) {
          return this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
          );
        }
      });

    return this.file.externalRootDirectory + '/Download/';
  }

  edit(idx: number) {
    const multisig: MultiSigDraft = this.drafts[idx];
    const { multisigInfo, unisgnedTransactions, signaturesInfo } = multisig;
    this.multisigServ.update(multisig);

    if (signaturesInfo) {
      this.router.navigate(['/msig-add-signatures']);
    } else if (unisgnedTransactions) {
      this.router.navigate(['/msig-create-transaction']);
    } else if (multisigInfo) {
      this.router.navigate(['/msig-add-info']);
    }
  }

  close() {
    this.isShowForm = false;
  }
}
