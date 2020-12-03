import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  AccAddress = '';
  errorMsg = '';
  isSending = false;
  rate: number;
  msgerror = '';
  submitted = false;

  formFeedback = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    comment: new FormControl('', [
      Validators.required,
      Validators.minLength(10)
    ])
  });

  httpOptions = {
    headers: new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    })
  };

  toast: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    public alertController: AlertController,
    private location: Location) {
  }

  ngOnInit() {
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

  changeRating() {

  }

  // Create a new item
  createItem(item: any) {
    const postData = (item);
    let url = environment.feedbackUrl + '/applications/11045/submit';
    url += '?key=6iiLMDdWejJrMi831uTdnZg4vSWlguwLBjbw5962Zu5EPA6c8xvKyhItme6hFWTs';
    this.http.post(url, postData, this.httpOptions)
      .subscribe(() => {
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
      });
  }

  CreateRecord() {
    this.submitted = true;

    if (this.formFeedback.valid) {
      this.isSending = true;

      const fb = {email: this.email.value, name: this.name.value, message: this.comment.value};
      this.createItem(fb);
    }
  }

  async showConfirmationSuccess() {

    this.formFeedback.reset();

    this.submitted = false;

    this.isSending = false;

    const alert = await this.alertController.create({
      header: 'Thank you for your feedback!',
      subHeader: 'If needed we will get back to you as soon as possible!',
      message: 'ZooBC Support Team',
      buttons: ['close']
    });

    alert.onDidDismiss().then(() => {
      this.location.back();
    });

    await alert.present();
  }

  get name() {
    return this.formFeedback.get('name');
  }

  get email() {
    return this.formFeedback.get('email');
  }

  get comment() {
    return this.formFeedback.get('comment');
  }

  RemoveRecord(rowID) {
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
    recordRow.isEdit = false;
  }

  goDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
