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
import { MultisigService } from 'src/app/Services/multisig.service';
import { NavigationExtras, Router } from '@angular/router';
import { Account } from 'src/app/Interfaces/account';
import zoobc, { Address, TransactionType } from 'zbc-sdk';
import { AccountService } from 'src/app/Services/account.service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { uniqueParticipant, getTranslation } from 'src/Helpers/utils';
import Swal from 'sweetalert2';
import { AccountPopupPage } from '../../account/account-popup/account-popup.page';
import { ModalController } from '@ionic/angular';
import { FROM_MSIG, MODE_NEW } from 'src/environments/variable.const';
import { type } from 'os';
import { getMultisigTitle } from 'src/Helpers/multisig-utils';

@Component({
  selector: 'app-msig-add-info',
  templateUrl: './msig-add-info.page.html',
  styleUrls: ['./msig-add-info.page.scss'],
})
export class MsigAddInfoPage implements OnInit {

  title: string;
  form: FormGroup;
  participantsField = new FormArray([], uniqueParticipant);
  fName = new FormControl('');
  fAddress = new FormControl('', [Validators.required]);
  fNonce = new FormControl('', [Validators.required, Validators.min(1)]);
  fMinSign = new FormControl('', [Validators.required, Validators.min(2)]);

  draft: MultiSigDraft;

  constructor(
    private multisigServ: MultisigService,
    private router: Router,
    private accServ: AccountService,
    private modalController: ModalController,
    private translate: TranslateService
  ) {

    // if temp account detected
    this.accServ.tempSubject.subscribe((acc) => {
      this.switchAccount(acc);
    });

    this.form = new FormGroup({
      name: this.fName,
      address: this.fAddress,
      participants: this.participantsField,
      nonce: this.fNonce,
      minSigs: this.fMinSign,
    });
  }

  ngOnInit() {
    this.draft = this.multisigServ.draft;
    if (this.draft) {
      const { multisigInfo } = this.draft;
      this.title = getMultisigTitle(this.draft.txType);
      this.createParticipantsField();
      if (multisigInfo) {
        const { participants, minSigs, nonce } = multisigInfo;
        const participansAddress = participants;
        this.extractData(participansAddress);
        this.fNonce.setValue(nonce);
        this.fMinSign.setValue(minSigs);
      }
    }
  }

  createParticipantsField(minParticpant: number = 2) {
    while (this.participantsField.length > 0) {
      this.participantsField.removeAt(0);
    }

    for (let i = 0; i < minParticpant; i++) {
      this.participantsField.push(new FormControl('', [Validators.required]));
    }
  }

  extractData(participants: Address[]) {
    while (this.participantsField.controls.length !== 0) {
      this.participantsField.removeAt(0);
    }

    participants.forEach((pcp, index) => {
      if (index <= 1) {
        this.participantsField.push(new FormControl(pcp.value, [Validators.required]));
      } else {
        this.participantsField.push(new FormControl(pcp));
      }
    });
  }

  switchAccount(account: Account) {
    if (account !== undefined) {
      this.fName.setValue(account.name);
      this.fAddress.setValue(account.address.value);
      this.extractData(account.participants);
      this.fNonce.setValue(account.nonce);
      this.fMinSign.setValue(account.minSig);
    }
  }

  addParticipant() {
    this.participantsField.push(new FormControl(''));
  }

  removeParticipant(index: number) {
    this.participantsField.removeAt(index);
  }

  async next() {
    if (this.form.valid) {
      const participants = this.filterParticipants();
      const accounts = (await this.accServ
        .allAccount())
        .filter(res => participants.some(ps => ps.value === res.address.value));

      if (accounts.length <= 0) {
        const message = getTranslation('you dont have any account that in participant list', this.translate);
        Swal.fire({ type: 'error', title: 'Oops...', text: message });
        return false;
      }

      const { minSigs, nonce } = this.form.value;
      const multisig = { ...this.draft };
      multisig.multisigInfo = {
        minSigs: Number(minSigs),
        nonce: Number(nonce),
        participants,
      };
      const multisigAddress = zoobc.MultiSignature.createMultiSigAddress(multisig.multisigInfo);
      multisig.txBody.sender = { value: multisigAddress, type: 0 };
      console.log('== Add Info: ', multisig);
      this.multisigServ.update(multisig);

      this.router.navigate(['/msig-create-transaction']);
    }
  }


  filterParticipants(): Address[] {
    const participants: string[] = this.form.value.participants;
    return participants
      .sort()
      .filter(address => address !== '')
      .map(pc => ({ value: pc, type: 0 }));
  }

  createAccount() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        account: null,
        mode: MODE_NEW,
        from: FROM_MSIG
      }
    };
    this.router.navigate(['/create-account'], navigationExtras);
  }

  async showAccountsPopup() {
    const modal = await this.modalController.create({
      component: AccountPopupPage,
      componentProps: {
        accType: 'multisig'
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        const acc: Account = dataReturned.data;
        console.log('==== this acc :', acc);
        if (acc !== undefined) {
          this.switchAccount(acc);
        }
      }
    });

    return await modal.present();
  }

  save() {
    console.log('= save =');
  }

  update() {
    console.log('= update =');
  }

  goHome() {
    this.router.navigate(['/tabs/home']);
  }
}
