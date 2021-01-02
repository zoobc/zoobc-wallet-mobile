import { Component, OnInit } from '@angular/core';
import { MultisigService } from 'src/app/Services/multisig.service';
import { Router } from '@angular/router';
import { Account } from 'src/app/Interfaces/account';
import zoobc, { Address } from 'zbc-sdk';
import { AccountService } from 'src/app/Services/account.service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { uniqueParticipant, getTranslation } from 'src/Helpers/utils';
import Swal from 'sweetalert2';
import { AccountPopupPage } from '../../account/account-popup/account-popup.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-msig-add-info',
  templateUrl: './msig-add-info.page.html',
  styleUrls: ['./msig-add-info.page.scss'],
})
export class MsigAddInfoPage implements OnInit {


    form: FormGroup;
    participantsField = new FormArray([], uniqueParticipant);
    nameField = new FormControl('');
    addressField = new FormControl('', [Validators.required]);
    nonceField = new FormControl('', [Validators.required, Validators.min(1)]);
    minSignatureField = new FormControl('', [Validators.required, Validators.min(2)]);

    draft: MultiSigDraft;

    constructor(
      private multisigServ: MultisigService,
      private router: Router,
      private accServ: AccountService,
      private modalController: ModalController,
      private translate: TranslateService,
      private formBuilder: FormBuilder
    ) {

      this.form = this.formBuilder.group({
        name: this.nameField,
        address: this.addressField,
        participants: this.participantsField,
        nonce: this.nonceField,
        minSigs: this.minSignatureField,
      });
    }

    ngOnInit() {
      this.draft  = this.multisigServ.multisigDraft;
      if (this.draft) {
        const { multisigInfo } = this.draft;
        console.log('== multisig onINit: ', this.draft);

        console.log('===  this.multisig:',  this.draft);
        this.pushInitParticipant();

        if (multisigInfo) {
          const { participants, minSigs, nonce } = multisigInfo;
          const addressParticipant = participants;
          this.patchParticipant(addressParticipant);
          this.nonceField.setValue(nonce);
          this.minSignatureField.setValue(minSigs);
        }
      }
    }

    pushInitParticipant(minParticpant: number = 2) {
      while (this.participantsField.length > 0) {
        this.participantsField.removeAt(0);
      }

      for (let i = 0; i < minParticpant; i++) {
        this.participantsField.push(new FormControl('', [Validators.required]));
      }
    }

    patchParticipant(participants: Address[]) {
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

    onSwitchAccount(account: Account) {
      if (account !== undefined) {
        this.nameField.setValue(account.name);
        this.addressField.setValue(account.address.value);
        this.patchParticipant(account.participants);
        this.nonceField.setValue(account.nonce);
        this.minSignatureField.setValue(account.minSig);
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
        multisig.txBody.sender = {value: multisigAddress, type: 0};
        console.log('== Add Info: ', multisig);
        this.multisigServ.update(multisig);

        this.router.navigate(['/msig-create-transaction']);
      }
    }

    // back() {
    //   this.location.back();
    // }

    filterParticipants(): Address[] {
      const participants: string[] = this.form.value.participants;
      return participants
        .sort()
        .filter(address => address !== '')
        .map(pc => ({ value: pc, type: 0 }));
    }

    goHome() {
      this.router.navigate(['/tabs/home']);
    }

//   account: Account;
//   accounts: Account[];

//   participants = ['', ''];

//   nonce: number;
//   minSig: number;
//   multisigSubs: Subscription;
//   multisig: MultiSigDraft;
//   isMultiSignature = false;
//   indexSelected: number;
//   msigAccount: any;
//   name: string;
//   address: string;

//   constructor(
//     private multisigSrv: MultisigService,
//     private router: Router,
//     private accountSrv: AccountService,
//     private modalController: ModalController
//   ) {
//     this.loadAllAccounts();
//   }

//   ngOnDestroy(): void {
//     if (this.multisigSubs) { this.multisigSubs.unsubscribe(); }
//   }

//   addParticipant() {
//     this.participants.push('');
//   }

//   reduceParticipant() {
//     const len = this.participants.length;
//     if (len > 2) {
//       this.participants.splice((len - 1), 1);
//     }
//   }

  async showPopupMultisigAccounts() {
    const modal = await this.modalController.create({
      component: AccountPopupPage,
      componentProps: {
        accType: 'multisig'
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        const acc: Account = dataReturned.data;
       // this.msigDraft = dataReturned.data;
        console.log('==== this acc :', acc );
        if (acc !== undefined) {
          this.onSwitchAccount(acc);
          // this.petchMsigAccount(this.msigDraft);
        }
      }
    });

    return await modal.present();
  }

//   petchMsigAccount(acc: Account) {
//     // this.participants = acc.participants;
//     this.name = acc.name;
//     // this.address = acc.address;
//     this.nonce = acc.nonce;
//     this.minSig = acc.minSig;
//   }

//   async showPopupAccount(index: number) {
//     this.indexSelected = index;
//     const modal = await this.modalController.create({
//       component: AccountPopupPage
//     });

//     modal.onDidDismiss().then((dataReturned) => {
//       if (dataReturned.data) {
//         this.participants[this.indexSelected] = dataReturned.data.address;
//       }
//     });

//     return await modal.present();
//   }


//   async ngOnInit() {
//     this.multisigSubs = this.multisigSrv.multisig.subscribe(async multisig => {
//       this.account = await this.accountSrv.getCurrAccount();
//       this.isMultiSignature = this.account.type === 'multisig' ? true : false;
//       const { multisigInfo, unisgnedTransactions, signaturesInfo } = multisig;
//       if (multisigInfo === undefined) {
//         this.router.navigate(['/multisig']);
//       }

//       this.multisig = multisig;
//       if (multisigInfo) {
//         const { participants, minSigs, nonce } = multisigInfo;
//         // this.participants = participants;
//         this.nonce = nonce;
//         this.minSig = minSigs;
//       } else if (this.isMultiSignature) {
//         this.loadMultisigData();
//       }
//     });
//   }

//   async loadAllAccounts() {
//     this.accounts = await this.accountSrv.allAccount('multisig');
//     if (this.accounts && this.accounts.length > 0) {
//       this.msigAccount = this.accounts[0];
//       this.petchMsigAccount(this.msigAccount);
//     }
//   }

//   async loadMultisigData() {
//     const account = await this.accountSrv.getCurrAccount();
//     const { participants, minSig, nonce } = account;
//     // this.participants = participants;
//     this.nonce = nonce;
//     this.minSig = minSig;
//   }

//   customTrackBy(index: number): any {
//     return index;
//   }

//   saveDraft() {
//     this.updateMultisig();
//     if (this.multisig.id) {
//       this.multisigSrv.editDraft();
//     } else {
//       this.multisigSrv.saveDraft();
//     }
//     this.router.navigate(['/tabs/home']);
//   }

//   next() {
//     this.updateMultisig();
//     if (!this.multisig.unisgnedTransactions) {
//       this.router.navigate(['/msig-create-transaction']);
//     } else if (!this.multisig.signaturesInfo) {
//       this.router.navigate(['/msig-add-signatures']);
//     } else {
//       this.router.navigate(['/msig-send-transaction']);
//     }
//   }

//   back() {
//     this.router.navigateByUrl('/multisig');
//   }

//   updateMultisig() {
//     const multisig = { ...this.multisig };

//     this.participants.sort();
//     this.participants = this.participants.filter(addrs => addrs !== '');

//     // multisig.multisigInfo = {
//     //   minSigs: this.minSig,
//     //   nonce: this.nonce,
//     //   // participants: this.participants
//     // };
//     const address = zoobc.MultiSignature.createMultiSigAddress(multisig.multisigInfo);
//     multisig.generatedSender = address;
//     this.multisigSrv.update(multisig);
//   }

}
