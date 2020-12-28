import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { STORAGE_MULTISIG_DRAFTS } from 'src/environments/variable.const';
import { TransactionType } from 'zbc-sdk';
import { MultiSigDraft } from '../Interfaces/multisig';
import { StoragedevService } from './storagedev.service';

@Injectable({
  providedIn: 'root'
})
export class MultisigService {


  private multisigTemplate: MultiSigDraft = {
    id: 0,
    accountAddress: null,
    fee: 0,
    txType: TransactionType.SENDMONEYTRANSACTION,
  };


  multisigDraft: MultiSigDraft;
  private sourceMultisig = new BehaviorSubject<MultiSigDraft>({ ...this.multisigTemplate });
  multisig = this.sourceMultisig.asObservable();

  constructor(private strgSrv: StoragedevService) { }

  update(multisig: MultiSigDraft) {
    this.multisigDraft = multisig;
    this.sourceMultisig.next(multisig);
  }

  getDrafts() {
    return this.strgSrv.getObject(STORAGE_MULTISIG_DRAFTS);
  }

  async saveDraft() {
    let multisigDrafts = await this.getDrafts();
    let len = 0;
    if (multisigDrafts) {
      len = multisigDrafts.length;
    } else {
      multisigDrafts = [];
    }
    this.sourceMultisig.value.id = new Date().getTime();
    multisigDrafts[len] = this.sourceMultisig.value;
    await this.strgSrv.setObject(STORAGE_MULTISIG_DRAFTS, multisigDrafts);
  }

  async editDraft() {
    const multisigDrafts = await this.getDrafts();
    for (let i = 0; i < multisigDrafts.length; i++) {
      const multisig = multisigDrafts[i];
      if (multisig.id === this.sourceMultisig.value.id) {
        multisigDrafts[i] = this.sourceMultisig.value;
        await this.strgSrv.setObject(STORAGE_MULTISIG_DRAFTS, multisigDrafts);
        break;
      }
    }
  }

  async deleteDraft(idx: number) {
    let multisigDrafts = await this.getDrafts();
    multisigDrafts = multisigDrafts.filter(draft => draft.id !== idx);
    await this.strgSrv.setObject(STORAGE_MULTISIG_DRAFTS, multisigDrafts);
  }

}
