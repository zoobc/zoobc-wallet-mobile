// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

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
        } else {
          this.errorMsg = error.error;
        }
        // this.showToast();
      });
  }

  CreateRecord() {
    this.submitted = true;

    if (this.formFeedback.valid) {
      this.isSending = true;

      const fb = { email: this.email.value, name: this.name.value, message: this.comment.value };
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
    this.router.navigate(['/tabs/home']);
  }
}
