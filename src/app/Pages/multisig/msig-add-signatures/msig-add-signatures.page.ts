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
import { Account } from 'src/app/Interfaces/account';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/Services/account.service';
import { signTransactionHash } from 'zbc-sdk';
import { UtilService } from 'src/app/Services/util.service';
import { getTranslation, stringToBuffer } from 'src/Helpers/utils';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-msig-add-signatures',
  templateUrl: './msig-add-signatures.page.html',
  styleUrls: ['./msig-add-signatures.page.scss'],
})
export class MsigAddSignaturesPage implements OnInit {

  form: FormGroup;
  fHash = new FormControl('', Validators.required);
  fSigner = new FormControl('');
  fSignatures = new FormArray([]);
  draft: MultiSigDraft;
  participants = [];
  signers = [];
  getSignature = false;
  account: Account;

  constructor(
    private multisigSrv: MultisigService,
    private router: Router,
    private translate: TranslateService,
    private utilSrv: UtilService,
    private accSrv: AccountService,
    private formBuilder: FormBuilder) {
    this.form = new FormGroup({
      transactionHash: this.fHash,
      participantsSignature: this.fSignatures,
      signer: this.fSigner
    });
  }

  ngOnInit() {
    this.draft = this.multisigSrv.draft;
    this.patchValue(this.draft);
    this.participants = this.draft.multisigInfo.participants.map(pc => pc.value);
    this.getSigner();
  }

  async getSigner() {
    this.signers = this.participants.slice();
  }

  patchValue(multisig: MultiSigDraft) {
    const { signaturesInfo } = multisig;
    this.fHash.patchValue(signaturesInfo.txHash);
    this.patchParticipant(signaturesInfo.participants);
  }

  patchParticipant(participant: any[]) {
    participant.forEach(pcp => {
      let address = '';
      let signature = '';
      if (typeof pcp === 'object') {
        address = pcp.address.value;
        signature = Buffer.from(pcp.signature).toString('base64');
      } else { address = pcp; }
      this.fSignatures.push(this.createParticipant(address, signature, false));
    });
  }

  createParticipant(address: string, signature: string, required: boolean): FormGroup {
    let validator = Validators.required;
    if (!required) { validator = null; }
    return this.formBuilder.group({
      address: [address, validator],
      signature: [signature, validator],
    });
  }


  async next() {
    const signatures = this.fSignatures.value.filter(
      (sign: any) => sign.signature !== null && sign.signature.length > 0
    );
    if (signatures.length > 0) {
      const { txHash } = this.draft.signaturesInfo;
      this.fHash.patchValue(txHash);
      this.update();
      this.router.navigate(['/msig-send-transaction']);
      return true;
    } else {
      const message = getTranslation('at least 1 signature must be filled', this.translate);
      Swal.fire('Error', message, 'error');
    }
  }

  async save() {
    this.update();
    if (this.draft.id === 0) {
      await this.multisigSrv.save();
    } else {
      await this.multisigSrv.edit();
    }
    this.router.navigate(['/multisig']);
  }

  update() {
    const { transactionHash, participantsSignature } = this.form.value;
    console.log('== transactionHash:', transactionHash);
    console.log('== participantsSignature:', participantsSignature);

    const multisig = { ...this.draft };
    const signatures = participantsSignature.map(participant => {
      participant.signature = stringToBuffer(participant.signature);
      return {
        address: { value: participant.address, type: 0 },
        signature: participant.signature,
      };
    });

    multisig.signaturesInfo = {
      txHash: transactionHash,
      participants: signatures,
    };

    this.multisigSrv.update(multisig);
  }

  sign() {
    if (!this.fSigner.value) {
      this.utilSrv.showAlert('Alert', '', 'Please select a signer first!');
      return;
    }

    this.changeAccount(this.fSigner.value);
    const { txHash, participants } = this.draft.signaturesInfo;
    let idx: number = participants.findIndex(pcp => pcp.address.value === this.account.address.value);

    if (this.account.type === 'multisig' && idx === -1) {
      idx = participants.findIndex(pcp => pcp.address.value === this.account.address.value);
    }
    const message = getTranslation('this account is not in participant list', this.translate);

    if (idx === -1) {
      return Swal.fire('Error', message, 'error');
    }

    const seed = this.accSrv.getTempSeed();
    const signature = signTransactionHash(txHash, seed);

    this.fSignatures.controls[idx].get('signature').patchValue(signature.toString('base64'));
  }

  changeAccount(account: Account) {
    this.account = account;
    this.accSrv.updateTempSeed(account);
  }

  toggleGetSignature() {
    this.getSignature = !this.getSignature;
  }

}
