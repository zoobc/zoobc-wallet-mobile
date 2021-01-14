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
import { Subject } from 'rxjs';
import { STORAGE_MULTISIG_DRAFTS } from 'src/environments/variable.const';
import { MultiSigDraft } from '../Interfaces/multisig';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MultisigService {

  subject: Subject<string> = new Subject<string>();
  msigHash: any;
  draft: MultiSigDraft;
  constructor(private strgSrv: StorageService) { }


  setHash(trxHash) {
    this.msigHash = trxHash;
  }

  getHash() {
    return this.msigHash;
  }

  getDrafts() {
    return this.strgSrv.getObject(STORAGE_MULTISIG_DRAFTS);
  }

  async save() {
    let multisigDrafts = await this.getDrafts();
    let len = 0;
    if (multisigDrafts) {
      len = multisigDrafts.length;
    } else {
      multisigDrafts = [];
    }
    this.draft.id = new Date().getTime();
    multisigDrafts[len] = this.draft;
    await this.strgSrv.setObject(STORAGE_MULTISIG_DRAFTS, multisigDrafts);
    this.subject.next('save');
  }

  async edit() {
    const multisigDrafts = await this.getDrafts();
    for (let i = 0; i < multisigDrafts.length; i++) {
      const multisig = multisigDrafts[i];
      if (multisig.id === this.draft.id) {
        multisigDrafts[i] = this.draft;
        await this.strgSrv.setObject(STORAGE_MULTISIG_DRAFTS, multisigDrafts);
        this.subject.next('edit');
        break;
      }
    }
  }

  async delete(idx: number) {
    let multisigDrafts = await this.getDrafts();
    if (multisigDrafts) {
      multisigDrafts = multisigDrafts.filter(draft => draft.id !== idx);
      await this.strgSrv.setObject(STORAGE_MULTISIG_DRAFTS, multisigDrafts);
      this.subject.next('delete');
    }
  }

  update(multisig: MultiSigDraft) {
    this.draft = multisig;
  }

}
