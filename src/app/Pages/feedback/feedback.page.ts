import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FeedbackService } from '../../Services/feedback.service';
import { AccountService } from 'src/app/Services/account.service';
import { ActiveAccountService } from 'src/app/Services/active-account.service';
import { makeShortAddress } from 'src/app/Helpers/converters';
import * as firebase from 'firebase';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { Location } from '@angular/common';
import { retry, catchError, timestamp } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ToastController, AlertController } from '@ionic/angular';
// import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

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

  // validationsForm: FormGroup;

  feedbackform: any;
  Name: string;
  Email: string;
  AccAddress = '';
  errorMsg = '';
  isSending = false;
  Comment: string;
  rate: number;
  msgerror = '';
  account = {
    accountName: '',
    address: '',
    qrCode: '',
    shortadress: ''
  };

  // validationMessages = {
  //   name: [
  //     { type: 'required', message: 'Name is required.' }
  //   ],
  //   email: [
  //     { type: 'required', message: 'Email is required.' },
  //     { type: 'pattern', message: 'Please wnter a valid email.' }
  //   ],
  //   comment: [
  //     { type: 'required', message: 'Last name is required.' }
  //   ],
  // };
  // Http Options
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
    private activeAccountSrv: ActiveAccountService,
    private location: Location,
    private accountService: AccountService) {

    this.activeAccountSrv.accountSubject.subscribe({
      next: v => {
        const address = this.accountService.getAccountAddress(v);
        this.account.shortadress = makeShortAddress(address);
        this.account.accountName = v.accountName;
        this.account.address = address;
        this.Name = '';
        this.AccAddress = this.account.address;
      }
    });

  }

  ngOnInit() {
    this.getActiveAccount();
    console.log('this accAddress: ', this.AccAddress);
    this.rate = 2;


    // this.validationsForm = this.formBuilder.group({
    //   name: new FormControl('', Validators.required),
    //   email: new FormControl('', Validators.compose([
    //     Validators.required,
    //     Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    //   ])),
    //   comment: new FormControl('', Validators.required),
    // });


 

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
    const activeAccount = await this.storage.get('active_account');
    const address = this.accountService.getAccountAddress(activeAccount);
    this.account.shortadress = makeShortAddress(address);
    this.account.accountName = activeAccount.accountName;
    this.account.address = address;
    this.Name = ''; // this.account.accountName;
    this.AccAddress = this.account.address;
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
      let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
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

    if (!this.isEmail(this.Email)){
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

  clearForm(){
    this.Email = '';
    this.Name  = '';
    this.Comment  = '';
  }

  CreateRecord_OLD() {
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




///


// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { Storage } from '@ionic/storage';
// import { FeedbackService } from '../../Services/feedback.service';
// import { AccountService } from 'src/app/Services/account.service';
// import { ActiveAccountService } from 'src/app/Services/active-account.service';
// import { makeShortAddress } from 'src/app/Helpers/converters';
// import * as firebase from 'firebase';
// import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
// import { throwError, Observable } from 'rxjs';
// import { retry, catchError, timestamp } from 'rxjs/operators';
// import { environment } from 'src/environments/environment';
// import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

// export class Feedback {
//   name: string;
//   email: string;
//   message: string;
//   nps: number;
//   language: string;
//   properties: string;
//   timestamp: string;
// }

// @Component({
//   selector: 'app-feedback',
//   templateUrl: './feedback.page.html',
//   styleUrls: ['./feedback.page.scss'],
// })



// export class FeedbackPage implements OnInit {

//   validationsForm: FormGroup;

//   feedbackform: any;
//   Name: string;
//   Email: string;
//   AccAddress = '';
//   Comment: string;
//   rate: number;
//   msgerror = '';
//   account = {
//     accountName: '',
//     address: '',
//     qrCode: '',
//     shortadress: ''
//   };

//   validationMessages = {
//     name: [
//       { type: 'required', message: 'Name is required.' }
//     ],
//     email: [
//       { type: 'required', message: 'Email is required.' },
//       { type: 'pattern', message: 'Please wnter a valid email.' }
//     ],
//     comment: [
//       { type: 'required', message: 'Last name is required.' }
//     ],
//   };
//   // Http Options
//   httpOptions = {
//     headers: new HttpHeaders({
//       Accept: 'application/json',
//       'Content-Type': 'application/json'
//     })
//   };

//   constructor(
//     private feedbackService: FeedbackService,
//     private router: Router,
//     private storage: Storage,
//     private http: HttpClient,
//     private activeAccountSrv: ActiveAccountService,
//     private accountService: AccountService,
//     public formBuilder: FormBuilder) {

//     this.activeAccountSrv.accountSubject.subscribe({
//       next: v => {
//         const address = this.accountService.getAccountAddress(v);
//         this.account.shortadress = makeShortAddress(address);
//         this.account.accountName = v.accountName;
//         this.account.address = address;
//         this.Name = '';
//         this.AccAddress = this.account.address;
//       }
//     });

//   }

//   ngOnInit() {
//     this.getActiveAccount();
//     console.log('this accAddress: ', this.AccAddress);
//     this.rate = 2;


//     this.validationsForm = this.formBuilder.group({
//       name: new FormControl('', Validators.required),
//       email: new FormControl('', Validators.compose([
//         Validators.required,
//         Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
//       ])),
//       comment: new FormControl('', Validators.required),
//     });


 

//   }

//   // Handle API errors
//   handleError(error: HttpErrorResponse) {
//     if (error.error instanceof ErrorEvent) {
//       // A client-side or network error occurred. Handle it accordingly.
//       console.error('An error occurred:', error.error.message);
//     } else {
//       // The backend returned an unsuccessful response code.
//       // The response body may contain clues as to what went wrong,
//       console.error(
//         `Backend returned code ${error.status}, ` +
//         `body was: ${error.error}`);
//     }
//     // return an observable with a user-facing error message
//     return throwError(
//       'Something bad happened; please try again later.');
//   }

//   async getActiveAccount() {
//     const activeAccount = await this.storage.get('active_account');
//     const address = this.accountService.getAccountAddress(activeAccount);
//     this.account.shortadress = makeShortAddress(address);
//     this.account.accountName = activeAccount.accountName;
//     this.account.address = address;
//     this.Name = ''; // this.account.accountName;
//     this.AccAddress = this.account.address;
//   }

//   changeRating(event) {
//     console.log('Your rate:', event);
//   }

//   // Create a new item
//   createItem(item) {
//     const postData = item;
//     let url = environment.feedbackUrl + '/applications/11045/submit';
//     url += '?key=6iiLMDdWejJrMi831uTdnZg4vSWlguwLBjbw5962Zu5EPA6c8xvKyhItme6hFWTs';
//     this.http.post(url, postData, this.httpOptions)
//       .subscribe(data => {
//         console.log(data);
//       }, error => {
//         console.log(error);
//       });
//   }

//   CreateRecord() {


//     if (!this.Name) {
//       this.msgerror = 'Name is empty';
//       return;
//     }

//     if (!this.Email) {
//       this.msgerror = 'Email is empty';
//       return;
//     }

//     if (!this.Comment) {
//       this.msgerror = 'Comment is empty';
//       return;
//     }


//     const fb: Feedback = {
//       email: this.Email,
//       name: this.Name,
//       timestamp: new Date().toDateString(),
//       message: this.Comment,
//       nps: 2,
//       language: 'english',
//       properties: this.AccAddress
//     };
//     this.createItem(fb);
//     this.clearForm();
//   }

//   clearForm(){
//     this.Email = '';
//     this.Name  = '';
//     this.Comment  = '';
//   }

//   CreateRecord_OLD() {
//     const record = {};

//     const tstamp = firebase.firestore.FieldValue.serverTimestamp();

//     // record['Name'] = this.Name;
//     record['AccAddress'] = this.AccAddress;
//     record['Comment'] = this.Comment;
//     record['CreatedDate'] = tstamp; //firebase.database.ServerValue.TIMESTAMP;
//     this.feedbackService.create(record).then(resp => {
//       this.Comment = '';
//       console.log(resp);
//     })
//       .catch(error => {
//         console.log(error);
//       });
//   }

//   RemoveRecord(rowID) {
//     this.feedbackService.delete(rowID);
//   }

//   EditRecord(record) {
//     record.isEdit = true;
//     record.EditName = record.Name;
//     record.EditAccAddress = record.AccAddress;
//     record.EditComment = record.Comment;
//   }

//   UpdateRecord(recordRow) {
//     const record = {};
//     record['Name'] = recordRow.EditName;
//     record['AccAddress'] = recordRow.EditAccAddress;
//     record['Comment'] = recordRow.EditComment;
//     this.feedbackService.update(recordRow.id, record);
//     recordRow.isEdit = false;
//   }

//   goDashboard() {
//     this.router.navigate(['/tabs/dashboard'])
//   }
// }
