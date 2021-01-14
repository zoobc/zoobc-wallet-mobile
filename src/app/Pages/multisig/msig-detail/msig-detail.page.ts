import { Component, OnInit } from '@angular/core';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { MultisigService } from 'src/app/Services/multisig.service';
import { getTxType } from 'src/Helpers/multisig-utils';
import { isZBCAddressValid } from 'zbc-sdk';

@Component({
  selector: 'app-msig-detail',
  templateUrl: './msig-detail.page.html',
  styleUrls: ['./msig-detail.page.scss'],
})
export class MsigDetailPage implements OnInit {

  draft: MultiSigDraft;
  txType: string;
  participants: string[];
  innerTx: any[] = [];
  constructor(private multisigSrv: MultisigService) { }

  ngOnInit() {
    this.draft = this.multisigSrv.draft;
    this.txType = getTxType(this.draft.txType);
    this.participants = this.draft.multisigInfo.participants.map(pc => pc.value);
    this.innerTx = Object.keys(this.draft.txBody).map(key => {
      const item = this.draft.txBody;
      console.log('= item[key]:', item[key]);
      return {
        key,
        value: item[key],
        isAddress: (item[key].value ? true : false),
      };
    });
    // console.log('== this.innerTx: ', this.innerTx);
  }

  txTypeLabel(txtype: number) {
    return getTxType(txtype);
  }
}
