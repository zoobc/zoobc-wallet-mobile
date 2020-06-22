import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MultisigService } from 'src/app/Services/multisig.service';
import { MultiSigDraft } from 'src/app/Interfaces/multisig';

@Component({
  selector: 'app-multisig',
  templateUrl: './multisig.page.html',
  styleUrls: ['./multisig.page.scss'],
})
export class MultisigPage implements OnInit {

  multiSigDrafts: MultiSigDraft[];

  addInfo = true;
  createTransaction = true;
  addSignature = true;
  multiSigCoPayer: any;
  isLoading: boolean;
  isError = false;

  isAddMultisigInfo: boolean;
  isSignature: boolean;
  isTransaction: boolean;
  isMultisigInfo = true;

  constructor(
    private router: Router,
    private multisigServ: MultisigService) { }

  ngOnInit() {
    this.getMultiSigDraft();
  }

  getMultiSigDraft() {
    this.multiSigDrafts = this.multisigServ.getDrafts();
  }

  goNextStep() {

    const multisig: MultiSigDraft = {
      accountAddress: '',
      fee: 0,
      id: 0,
    };

    if (this.isMultisigInfo) { multisig.multisigInfo = null; }
    if (this.isTransaction) { multisig.unisgnedTransactions = null; }
    if (this.isSignature) { multisig.signaturesInfo = null; }

    this.multisigServ.update(multisig);
    if (this.isMultisigInfo) {
      this.router.navigate(['/msig-add-info']);
    } else if (this.isTransaction) {
      this.router.navigate(['/msig-create-transaction']);
    } else if (this.isSignature) {
      this.router.navigate(['/msig-add-participants']);
    }

  }


  showInfo() {
    this.addInfo = !this.addInfo;
  }

  doCreateTransaction() {
    this.createTransaction = !this.createTransaction;
  }

  doAddSignature() {
    this.addSignature = !this.createTransaction;
  }

  next() {
    console.log('Next clicked');
  }

  refresh() {
    console.log('Refresh clicked');
  }

}
