import { Component, OnInit } from '@angular/core';
import { MultisigService } from 'src/app/Services/multisig.service';
import { NavigationExtras, Router } from '@angular/router';
import { Account } from 'src/app/Interfaces/account';
import zoobc, { Address } from 'zbc-sdk';
import { AccountService } from 'src/app/Services/account.service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { uniqueParticipant, getTranslation } from 'src/Helpers/utils';
import Swal from 'sweetalert2';
import { AccountPopupPage } from '../../account/account-popup/account-popup.page';
import { ModalController } from '@ionic/angular';
import { MODE_NEW } from 'src/environments/variable.const';

@Component({
  selector: 'app-msig-add-info',
  templateUrl: './msig-add-info.page.html',
  styleUrls: ['./msig-add-info.page.scss'],
})
export class MsigAddInfoPage implements OnInit {


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

    this.form = new FormGroup({
      name: this.fName,
      address: this.fAddress,
      participants: this.participantsField,
      nonce: this.fNonce,
      minSigs: this.fMinSign,
    });
  }

  ngOnInit() {
    this.draft = this.multisigServ.multisigDraft;
    if (this.draft) {
      const { multisigInfo } = this.draft;
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
        mode: MODE_NEW
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
