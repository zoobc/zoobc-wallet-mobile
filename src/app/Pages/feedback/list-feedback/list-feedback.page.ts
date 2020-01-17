import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/Services/feedback.service';
import { Router } from '@angular/router';
import { ActiveAccountService } from 'src/app/Services/active-account.service';
import { AccountService } from 'src/app/Services/account.service';
import { makeShortAddress } from 'src/app/Helpers/converters';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-list-feedback',
  templateUrl: './list-feedback.page.html',
  styleUrls: ['./list-feedback.page.scss'],
})
export class ListFeedbackPage implements OnInit {

  feedbackform: any;
  Name: string;
  AccAddress = '';
  Comment: string;
  rate: number;

  account = {
    accountName: '',
    address: '',
    qrCode: '',
    shortadress: ''
  };

  constructor(private feedbackService: FeedbackService,
              private storage: Storage,
              private activeAccountSrv: ActiveAccountService,
              private accountService: AccountService) {


    this.activeAccountSrv.accountSubject.subscribe({
      next: v => {
        const address = this.accountService.getAccountAddress(v);
        this.account.shortadress = makeShortAddress(address);
        this.account.accountName = v.accountName;
        this.account.address = address;
        this.Name = this.account.accountName;
        this.AccAddress = this.account.shortadress;
      }
    });

  }

  ngOnInit() {
    this.getActiveAccount();
    console.log('this accAddress: ', this.AccAddress);
    this.rate = 2;

    this.feedbackService.read().subscribe(data => {
      this.feedbackform = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          CreatedDate: e.payload.doc.data()['CreatedDate']['seconds'],
          AccAddress: e.payload.doc.data()['AccAddress'],
          Comment: e.payload.doc.data()['Comment'],
        };
      });
      console.log(this.feedbackform);
    });

  }

  async getActiveAccount() {
    const activeAccount = await this.storage.get('active_account');
    const address = this.accountService.getAccountAddress(activeAccount);
    this.account.shortadress = makeShortAddress(address);
    this.account.accountName = activeAccount.accountName;
    this.account.address = address;
    this.Name = this.account.accountName;
    this.AccAddress = this.account.shortadress;
  }

}
