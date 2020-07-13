import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/Services/auth-service';
import { onCopyText } from 'src/Helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import { MultisigService } from 'src/app/Services/multisig.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { signTransactionHash } from 'zoobc-sdk';
import { Account } from 'src/app/Interfaces/account';
import { AlertController } from '@ionic/angular';
import { AccountService } from 'src/app/Services/account.service';
import { UtilService } from 'src/app/Services/util.service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';

@Component({
  selector: 'app-msig-add-participants',
  templateUrl: './msig-add-participants.page.html',
  styleUrls: ['./msig-add-participants.page.scss'],
})
export class MsigAddParticipantsPage implements OnInit, OnDestroy {

  form: FormGroup;

  transactionHashField = new FormControl('', Validators.required);
  participantsSignatureField = new FormArray([]);

  account: Account;
  enabledAddParticipant = false;
  readOnlyTxHash = false;
  multisig: MultiSigDraft;
  multisigSubs: Subscription;
  participantAddress: string[] = [];

  selectedDesign = 1;
  url = 'https://zoobc.one/...SxhdnfHF';

  stepper = {
    multisigInfo: false,
    transaction: false,
  };

  constructor(
    private translate: TranslateService,
    private multisigServ: MultisigService,
    private router: Router,
    private location: Location,
    private activeRoute: ActivatedRoute,
    private authServ: AuthService,
    private alertController: AlertController,
    private utilService: UtilService,
    private accountService: AccountService
  ) {
    this.form = new FormGroup({
      transactionHash: this.transactionHashField,
      participantsSignature: this.participantsSignatureField,
    });
  }

  ngOnInit() {
    this.multisigSubs = this.multisigServ.multisig.subscribe(multisig => {
      const { multisigInfo, unisgnedTransactions } = multisig;
      this.multisig = multisig;

      this.stepper.multisigInfo = multisigInfo !== undefined ? true : false;
      this.stepper.transaction = unisgnedTransactions !== undefined ? true : false;
    });

    // tslint:disable-next-line:no-string-literal
    if (this.activeRoute.snapshot.params['txHash']) {
      const { txHash, signature, address } = this.activeRoute.snapshot.params;
      const multiSignDraft = this.multisigServ
        .getDrafts()
        .find(draft => draft.signaturesInfo.txHash === txHash);
      const participantValid = this.checkValidityParticipant(multiSignDraft, address);
      if (!multiSignDraft || !participantValid) {
        this.showError('Error', 'Draft not found', 'error');
        return this.router.navigate(['/multisignature']);
      }
      this.multisigServ.update(multiSignDraft);
      this.patchValue(this.multisig);
      this.prefillSignAddress(address, signature);
      this.enabledAddParticipant = this.checkEnabledAddParticipant(this.multisig);
      return (this.readOnlyTxHash = this.checkReadOnlyTxHash(this.multisig));
    }

    if (this.multisig.signaturesInfo === undefined) { return this.router.navigate(['/multisignature']); }

    this.patchValue(this.multisig);
    this.enabledAddParticipant = this.checkEnabledAddParticipant(this.multisig);
    this.readOnlyTxHash = this.checkReadOnlyTxHash(this.multisig);
  }

  ngOnDestroy() {
    if (this.multisigSubs) { this.multisigSubs.unsubscribe(); }
  }

  checkValidityParticipant(multisig: MultiSigDraft, address: string) {
    // const { signaturesInfo, multisigInfo, unisgnedTransactions } = multisig;
    // if (
    //   !signaturesInfo ||
    //   signaturesInfo == null ||
    //   // signaturesInfo.participants.filter(pcp => pcp.address.length === 0).length > 0
    // ) {
    //   if (multisigInfo) {
    //     length = multisigInfo.participants.filter(pcp => pcp === address).length;
    //   } else if (unisgnedTransactions) {
    //     this.accountService.allAccount().then(accounts => {
    //       const account = accounts.find(acc => acc.address === unisgnedTransactions.);
    //       length = account.participants.filter(pcp => pcp === address).length;
    //     });
    //   } else { length = 1; }
    // } else { length = signaturesInfo.participants.filter(pcp => pcp.address === address).length; }
    // if (length > 0) { return true; }
    return false;
  }

  patchValue(multisig: MultiSigDraft) {
    const { signaturesInfo, multisigInfo, unisgnedTransactions } = multisig;

    if (!signaturesInfo || signaturesInfo == null) {
      if (multisigInfo) { return this.patchParticipant(multisigInfo.participants, true); }
      // if (unisgnedTransactions) { return this.patchUnsignedAddress(unisgnedTransactions.sender); }
      return this.pushInitParticipant();
    }
    if (signaturesInfo.txHash) { this.transactionHashField.patchValue(signaturesInfo.txHash); }
    if (signaturesInfo.participants) { this.patchParticipant(signaturesInfo.participants, false); }
    this.enabledAddParticipant = true;
  }

  patchUnsignedAddress(addres: string) {
    this.accountService.allAccount().then(accounts => {
      const account = accounts.find(acc => acc.address === addres);
      this.patchParticipant(account.participants, true);
    });
  }

  prefillSignAddress(address: string, signature: string) {
    let idx: number;
    idx = this.participantAddress.findIndex(pcp => pcp === address);
    if (idx < 0) {
      idx = this.multisig.signaturesInfo.participants.findIndex(
        pcp => this.jsonBufferToString(pcp.signature) === signature
      );
      if (idx < 0) { idx = this.participantAddress.findIndex(pcp => pcp.length === 0); }
      if (idx < 0) { idx = 0; }
    }

    this.participantsSignatureField.controls[idx].patchValue(signature);
  }

  checkEnabledAddParticipant(multisig: MultiSigDraft) {
    const { multisigInfo, unisgnedTransactions } = multisig;
    if (multisigInfo || unisgnedTransactions) { return false; }
    return true;
  }

  checkReadOnlyTxHash(multisig: MultiSigDraft) {
    const { unisgnedTransactions } = multisig;
    if (!unisgnedTransactions || unisgnedTransactions == null) { return false; }
    const txHash = this.generateRandomTxHash();
    this.transactionHashField.patchValue(txHash);
    return true;
  }

  patchParticipant(participant: any[], empty: boolean) {
    participant.forEach(pcp => {
      if (typeof pcp === 'object') { this.participantAddress.push(pcp.address); } else { this.participantAddress.push(pcp); }

      if (empty) {
        this.participantsSignatureField.push(new FormControl('', [Validators.required]));
      } else {
        this.participantsSignatureField.push(
          new FormControl(this.jsonBufferToString(pcp.signature), [Validators.required])
        );
      }
    });
  }

  pushInitParticipant(minParticipant: number = 2) {
    for (let i = 0; i < minParticipant; i++) {
      this.participantAddress.push('');
      this.participantsSignatureField.push(new FormControl('', [Validators.required]));
    }
  }

  addParticipant() {
    this.participantAddress.push('');
    this.participantsSignatureField.push(new FormControl(''));
  }

  removeParticipant(index: number) {
    this.participantsSignatureField.removeAt(index);
    this.participantAddress.splice(index, 1);
  }

  getAddress(idx: number) {
    return this.participantAddress[idx];
  }

  updateMultiStorage() {
    const { transactionHash, participantsSignature } = this.form.value;
    const multisig = { ...this.multisig };

    const participant = [];
    participantsSignature.map((pcp, index) => {
      participant[index] = {
        address: this.getAddress(index),
        signature: this.stringToBuffer(String(pcp)),
      };
    });

    multisig.signaturesInfo = {
      txHash: transactionHash,
      participants: participant,
    };

    this.multisigServ.update(multisig);
  }

  jsonBufferToString(buf: any) {
    try {
      return Buffer.from(buf.data, 'utf-8').toString();
    } catch (error) {
      return buf.toString('utf-8');
    }
  }

  stringToBuffer(str: string) {
    return Buffer.from(str, 'utf-8');
  }

  onBack() {
    this.location.back();
  }

  onNext() {
    this.updateMultiStorage();
    this.router.navigate(['/multisignature/send-transaction']);
  }

  onSave() {
    if (!this.form.valid) { return null; }
    this.updateMultiStorage();
    if (this.multisig.id === 0) {
      this.multisigServ.saveDraft();
    } else {
      this.multisigServ.editDraft();
    }
    this.router.navigate(['/multisignature']);
  }

  async onAddSignature() {
    const { multisigInfo, unisgnedTransactions } = this.multisig;
    // const curAcc = this.authServ.getCurrAccount();
    const curAcc = await this.accountService.getCurrAccount();
    const { transactionHash } = this.form.value;

    // TODO change hardcode PIN
    const pin = '111111';
    const seed = await this.utilService.generateSeed(pin, this.account.path);

    const signature = signTransactionHash(transactionHash, seed);

    if (curAcc.type !== 'normal') { return this.showError('Error', 'Multisig Account cant sign !', 'error'); }
    if (multisigInfo || unisgnedTransactions) {
      if (!this.participantAddress.includes(curAcc.address)) {
        return this.showError('Error', 'This account not in Participants', 'error');
      }
      const idx = this.participantAddress.indexOf(curAcc.address);
      return this.participantsSignatureField.controls[idx].patchValue(signature.toString('base64'));
    }

    const index = this.participantsSignatureField.controls.findIndex(ctrl => ctrl.value.length === 0);
    if (index === -1) {
      return this.participantsSignatureField.controls[
        this.participantsSignatureField.controls.length - 1
      ].patchValue(signature.toString('base64'));
    }

    this.participantsSignatureField.controls[index].patchValue(signature.toString('base64'));
  }

  onSwitchAccount(account: Account) {
    this.account = account;
  }

  async onCopyUrl() {
    onCopyText(this.url);
    let message: string;
    await this.translate
      .get('Link Copied')
      .toPromise()
      .then(res => (message = res));
    // this.snackBar.open(message, null, { duration: 3000 });
  }

  // temporary function
  generateRandomTxHash(length: number = 10) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async showError(title: string, msg: string, ertxt: string ) {
    const alert = await this.alertController.create({
      cssClass: 'alertCss',
      header: 'Alert',
      subHeader: title,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

}