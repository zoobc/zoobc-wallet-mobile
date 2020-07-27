import { Component, OnInit } from '@angular/core';
import { MultisigService } from 'src/app/Services/multisig.service';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/Interfaces/account';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/Services/account.service';
import { Participant } from 'src/app/Interfaces/participant';
import { signTransactionHash } from 'zoobc-sdk';
import { UtilService } from 'src/app/Services/util.service';
import { AuthService } from 'src/app/Services/auth-service';
import { stringToBuffer } from 'src/Helpers/utils';

@Component({
  selector: 'app-msig-add-signatures',
  templateUrl: './msig-add-signatures.page.html',
  styleUrls: ['./msig-add-signatures.page.scss'],
})
export class MsigAddSignaturesPage implements OnInit {

  transactionHash = '';
  participantsSignature = [];

  account: Account;
  enabledAddParticipant = false;
  readOnlyTxHash = false;
  readOnlyAddress = false;
  multisig: MultiSigDraft;
  multisigSubs: Subscription;

  stepper = {
    multisigInfo: false,
    transaction: false,
  };

  constructor(
    private multisigServ: MultisigService,
    private router: Router,
    private accountSrv: AccountService,
    private authSrv: AuthService,
    private utilSrv: UtilService) { }

  ngOnInit() {
    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      const { multisigInfo, unisgnedTransactions } = multisig;
      this.multisig = multisig;
      this.stepper.multisigInfo = multisigInfo !== undefined ? true : false;
      this.stepper.transaction = unisgnedTransactions !== undefined ? true : false;
    });

    if (this.multisig.signaturesInfo === undefined) {
      return this.router.navigate(['/multisig']);
    }

    this.patchValue(this.multisig);
    // this.enabledAddParticipant = this.checkEnabledAddParticipant(this.multisig);
    this.readOnlyTxHash = this.checkReadOnlyTxHash(this.multisig);
    // this.readOnlyAddress = this.checkReadOnlyAddress(this.multisig);
  }

  async patchValue(multisig: MultiSigDraft) {
    const { signaturesInfo, multisigInfo, unisgnedTransactions, transaction } = multisig;

    if (!signaturesInfo || signaturesInfo == null) {
      if (multisigInfo) {
        return this.patchParticipant(multisigInfo.participants);
      }
      if (unisgnedTransactions) {
        return this.patchUnsignedAddress(transaction.sender);
      }

      const acc = await this.accountSrv.getCurrAccount();
      return this.pushInitParticipant(1, acc);
    }
    if (signaturesInfo.txHash) {
      this.transactionHash = signaturesInfo.txHash;
    }
    if (signaturesInfo.participants) {
      this.patchParticipant(signaturesInfo.participants);
    }

    this.enabledAddParticipant = true;
  }


  patchParticipant(participant: any[]) {
    participant.forEach(pcp => {
      let address = '';
      let signature = '';
      if (typeof pcp === 'object') {
        address = pcp.address;
        signature = Buffer.from(pcp.signature).toString('base64');
      } else { address = pcp; }
      this.participantsSignature.push(this.createParticipant(address, signature));
    });
  }

  createParticipant(address: string, signature: string) {
    const participant: Participant = {
      address,
      signature
    };
    return participant;
  }


  async patchUnsignedAddress(addres: string) {
    const accounts = await this.accountSrv.allAccount();
    const account = accounts.find(acc => acc.address === addres);
    this.patchParticipant(account.participants);
  }

  customTrackBy(index: number): any {
    return index;
  }

  async checkEnabledAddParticipant(multisig: MultiSigDraft) {
    const { multisigInfo, unisgnedTransactions } = multisig;
    if (multisigInfo || unisgnedTransactions) { return false; }
    if ((await this.accountSrv.getCurrAccount()).type === 'multisig') {
      return false;
    }
    return true;
  }


  updateMultiStorage() {
    const multisig = { ...this.multisig };

    const newPcp = this.participantsSignature.map(pcp => {
      pcp.signature = stringToBuffer(pcp.signature);
      return pcp;
    });

    multisig.signaturesInfo = {
      txHash: this.transactionHash,
      participants: newPcp,
    };

    this.multisigServ.update(multisig);
  }

  checkReadOnlyTxHash(multisig: MultiSigDraft) {
    const { signaturesInfo, unisgnedTransactions } = multisig;
    if (!signaturesInfo || signaturesInfo == null) { return false; }
    if (!unisgnedTransactions) { return false; }
    const txHash = signaturesInfo.txHash;
    this.transactionHash = txHash;
    return true;
  }

  async addSignature() {
    const curAcc = await this.accountSrv.getCurrAccount();
    let idx = this.participantsSignature.findIndex(pcp => pcp.address === curAcc.address);
    if (curAcc.type === 'multisig' && idx === -1) {
      idx = this.participantsSignature.findIndex(pcp => pcp.address === curAcc.signByAddress);
    }

    if (idx === -1) {
      this.utilSrv.showConfirmation('Error', 'This account is not in Participant List', false, null);
      return;
    }
    const signerAddress =  this.participantsSignature[idx].address;
    const signerAccount =  await this.accountSrv.getAccount(signerAddress);
    const key = this.authSrv.tempKey;
    const seed = await this.utilSrv.generateSeed(key, signerAccount.path);
    const signature = signTransactionHash(this.transactionHash, seed);
    const base64Sig = signature.toString('base64');
    this.participantsSignature[idx].signature = base64Sig;
  }

  async next() {
    const signatures = this.participantsSignature.filter(
      sign => sign.signature !== null && sign.signature.length > 0
    );

    if (signatures.length > 0) {
      this.updateMultiStorage();
      return this.router.navigate(['/msig-send-transaction']);
    }
    const message = this.utilSrv.showConfirmation('Error', 'At least 1 signature must be filled', false, null);
  }

  saveDraft() {
    this.updateMultiStorage();
    if (this.multisig.id === 0) {
      this.multisigServ.saveDraft();
    } else {
      this.multisigServ.editDraft();
    }
    this.router.navigate(['/dashboard']);
  }

  async checkReadOnlyAddress(multisig: MultiSigDraft) {
    const { multisigInfo, unisgnedTransactions } = multisig;
    if (multisigInfo || unisgnedTransactions) { return true; }
    if ((await this.accountSrv.getCurrAccount()).type === 'multisig') {
      return true;
    }
    return false;
  }

  pushInitParticipant(minParticipant: number, curAccount: Account) {
    if (curAccount.type === 'normal') {
      for (let i = 0; i < minParticipant; i++) {
        this.participantsSignature.push(this.createParticipant('', ''));
      }
      return null;
    }
    curAccount.participants.forEach(pcp => {
      this.participantsSignature.push(this.createParticipant(pcp, ''));
    });
  }

}
