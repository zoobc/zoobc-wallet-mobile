import { Component, OnInit } from '@angular/core';

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
