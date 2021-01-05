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
