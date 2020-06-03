import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AccountService } from 'src/app/Services/account.service';
import { AddressBookService } from 'src/app/Services/address-book.service';

@Component({
  selector: 'app-multisig',
  templateUrl: './multisig.page.html',
  styleUrls: ['./multisig.page.scss'],
})
export class MultisigPage implements OnInit {
  
  addInfo = true;
  createTransaction = true;
  addSignature = true;
  multiSigCoPayer: any;
  isLoading: boolean;
  isError = false;

  isAddMultisigInfo: boolean;
  isAddParticipant: boolean;
  isCreateTransaction: boolean;
  
  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private accountService: AccountService,
    private addresBookSrv: AddressBookService) { }

  ngOnInit() {
    this.isLoading = true;

    this.multiSigCoPayer = [
      {
        sender: '',
        senderName: '',
        recipient: '',
        recipientName: '',
        amount: 10,
      }
    ];
    this.isLoading = false;
    this.isError = false;
  }

  goNextStep(){
    if (this.isAddMultisigInfo) {
      this.router.navigateByUrl('/msig-create-info');
      return;
    }
    if (this.isCreateTransaction) {
      this.router.navigateByUrl('/msig-create-transaction');
      return;
    }
    if (this.isAddParticipant) {
      this.router.navigateByUrl('/msig-add-signature');
      return;
    }

    this.router.navigateByUrl('/msig-create-info');
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
