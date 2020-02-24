import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FeedbackService } from '../../Services/feedback.service';
import { makeShortAddress } from 'src/Helpers/converters';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
import { STORAGE_CURRENT_ACCOUNT } from 'src/environments/variable.const';
import { AccountInf } from 'src/app/Services/auth-service';
import { AccountService } from 'src/app/Services/account.service';

export class Feedback {
  name: string;
  email: string;
  message: string;
  nps: number;
  timestamp: string;
}

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})

export class FeedbackPage implements OnInit {

  feedbackform: any;
  Name: string;
  Email: string;
  AccAddress = '';
  errorMsg = '';
  isSending = false;
  Comment: string;
  rate: number;
  msgerror = '';
  account: AccountInf;

  httpOptions = {
    headers: new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    })
  };

   toast: any;


  constructor(
    private feedbackService: FeedbackService,
    private router: Router,
    private storage: Storage,
    private http: HttpClient,
    public alertController: AlertController,
    private accountService: AccountService,
    private location: Location) {

    this.accountService.accountSubject.subscribe({
      next: v => {
        this.account = v;
      }
    });

  }

  ngOnInit() {
    this.getActiveAccount();
    console.log('this accAddress: ', this.AccAddress);
    this.rate = 2;
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }

    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  async getActiveAccount() {
    this.account = this.accountService.getCurrAccount();
  }

  changeRating(event) {
    console.log('Your rate:', event);
  }

  // Create a new item
  createItem(item: any) {
    console.log('Dta will send: ', item);
    const postData = JSON.stringify(item);
    let url = environment.feedbackUrl + '/applications/11045/submit';
    url += '?key=6iiLMDdWejJrMi831uTdnZg4vSWlguwLBjbw5962Zu5EPA6c8xvKyhItme6hFWTs';
    this.http.post(url, postData, this.httpOptions)
      .subscribe(data => {
        console.log('Response from server: ', data);
        this.isSending = false;
      }, error => {
        this.isSending = false;
        this.errorMsg = error.status;
        if (error.status === 201) {
          this.showConfirmationSuccess();
          this.errorMsg = '';
          // this.location.back();
        } else  {
          this.errorMsg = error.error;
        }
        // this.showToast();
        console.log('== Have error when submit: ', error);
      });
  }

  isEmail(search: string): boolean {
      let serchfind: boolean;
      // tslint:disable-next-line:max-line-length
      const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      serchfind = regexp.test(search);
      console.log('is email valid', serchfind);
      return serchfind;
  }

  CreateRecord() {
    this.errorMsg = '';
    this.isSending = false;
    if (!this.Name) {
      this.errorMsg = 'Name is empty';
      return;
    }

    if (this.Name.length < 4) {
      this.errorMsg = 'Name is to short';
      return;
    }

    if (!this.Email) {
      this.errorMsg = 'Email is empty';
      return;
    }

    if (!this.isEmail(this.Email)) {
      this.errorMsg = 'Email is not valid';
      return;
    }

    if (!this.Comment) {
      this.errorMsg = 'Comment is empty';
      return;
    }


    if (this.Comment.length < 10) {
      this.errorMsg = 'Comment is to short';
      return;
    }

    this.isSending = true;
    const fb = {email: this.Email, name: this.Name, message: this.Comment};
    this.createItem(fb);
  }

  async showConfirmationSuccess() {
    const alert = await this.alertController.create({
      header: 'Thank you for your feedback!',
      subHeader: 'If needed we will get back to you as soon as possible!',
      message: 'ZooBC Support Team',
      buttons: ['close']
    });

    alert.onDidDismiss().then(msg => {
      this.location.back();
    });

    await alert.present();
  }

  clearForm() {
    this.Email = '';
    this.Name  = '';
    this.Comment  = '';
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
    // tslint:disable-next-line:no-string-literal
    record['Name'] = recordRow.EditName;
    // tslint:disable-next-line:no-string-literal
    record['AccAddress'] = recordRow.EditAccAddress;
    // tslint:disable-next-line:no-string-literal
    record['Comment'] = recordRow.EditComment;
    this.feedbackService.update(recordRow.id, record);
    recordRow.isEdit = false;
  }

  goDashboard() {
    this.router.navigate(['/tabs/dashboard']);
  }
}
