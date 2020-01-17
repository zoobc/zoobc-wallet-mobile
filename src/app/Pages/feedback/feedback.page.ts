import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FeedbackService } from '../../Services/feedback.service';
import { AccountService } from 'src/app/Services/account.service';
import { ActiveAccountService } from 'src/app/Services/active-account.service';
import { makeShortAddress } from 'src/app/Helpers/converters';
import * as firebase from 'firebase';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

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

  constructor(
    private feedbackService: FeedbackService,
    private router: Router,
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
        this.AccAddress = this.account.address;
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
          Name: e.payload.doc.data()['Name'],
          AccAddress: e.payload.doc.data()['AccAddress'],
          Comment: e.payload.doc.data()['Comment'],
        };
      })
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
    this.AccAddress = this.account.address;
  }

  changeRating(event) {
    console.log('Your rate:', event);
  }

  CreateRecord() {
    const record = {};

    const tstamp = firebase.firestore.FieldValue.serverTimestamp();

    // record['Name'] = this.Name;
    record['AccAddress'] = this.AccAddress;
    record['Comment'] = this.Comment;
    record['CreatedDate'] = tstamp; //firebase.database.ServerValue.TIMESTAMP;
    this.feedbackService.create(record).then(resp => {
      this.Comment = '';
      console.log(resp);
    })
      .catch(error => {
        console.log(error);
      });
  }

  RemoveRecord(rowID) {
    this.feedbackService.delete(rowID);
  }

  EditRecord(record) {
    record.isEdit = true;
    record.EditName = record.Name;
    record.EditAccAddress = record.AccAddress;
    record.EditComment = record.Comment;
  }

  UpdateRecord(recordRow) {
    const record = {};
    record['Name'] = recordRow.EditName;
    record['AccAddress'] = recordRow.EditAccAddress;
    record['Comment'] = recordRow.EditComment;
    this.feedbackService.update(recordRow.id, record);
    recordRow.isEdit = false;
  }

  goDashboard() {
    this.router.navigate(['/tabs/dashboard'])
  }


}
