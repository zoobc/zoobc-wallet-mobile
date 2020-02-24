import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/Services/feedback.service';
import { Router } from '@angular/router';
import { ActiveAccountService } from 'src/app/Services/active-account.service';
import { AccountService } from 'src/app/Services/account.service';
import { makeShortAddress } from 'src/Helpers/converters';
import { Storage } from '@ionic/storage';
import { STORAGE_CURRENT_ACCOUNT } from 'src/environments/variable.const';

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
        const address = v.address;
        this.account.shortadress = makeShortAddress(address);
        this.account.accountName = v.name;
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
          // tslint:disable-next-line:no-string-literal
          CreatedDate: e.payload.doc.data()['CreatedDate']['seconds'],
          // tslint:disable-next-line:no-string-literal
          AccAddress: e.payload.doc.data()['AccAddress'],
          // tslint:disable-next-line:no-string-literal
          Comment: e.payload.doc.data()['Comment'],
        };
      });
      console.log(this.feedbackform);
    });

  }

  async getActiveAccount() {
    const activeAccount = await this.storage.get(STORAGE_CURRENT_ACCOUNT);
    const address = activeAccount.address;
    this.account.shortadress = makeShortAddress(address);
    this.account.accountName = activeAccount.name;
    this.account.address = address;
    this.Name = activeAccount.name;
    this.AccAddress = this.account.shortadress;
  }

}
