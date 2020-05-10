/*
Note:
FCM token will get when user loogin / Account login in dashboard
FCM token will delete when user logout.

When create account will update users db in firebase.
*/
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Interfaces/account';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { ChatService } from 'src/app/Services/chat.service';
import { User } from 'src/app/Interfaces/chatmodels';
import { auth } from 'firebase/app';        // for authentication
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  addresses = [];
  account: Account;
  chatuser: User;
  fcmToken: string;
  fcmUid: string;

  constructor(private router: Router,
              private oneSignal: OneSignal,
              private chatService: ChatService,
              private addressBookSrv: AddressBookService,
              private accountService: AccountService) {

    this.accountService.accountSubject.subscribe(() => {
      this.loadAccount();
    });
  }

  async loadAccount() {
    this.account = await this.accountService.getCurrAccount();
  }

  getFcmId() {
    this.oneSignal.getIds().then(identity => {
      this.fcmUid = identity.userId;
      this.fcmToken = identity.pushToken;
    });
  }

  ngOnInit() {
    this.getFcmId();
    this.loadAccount();
    this.getAllAddress();
    console.log('---- All address in chat---- :', this.addresses);
  }

  async showSession(idx: number) {
    auth().signInAnonymously();
    auth().onAuthStateChanged(firebaseUser => {
      console.log('Firebase User: ', firebaseUser);
    });

    const chat = this.addresses[idx];
    console.log('... di session ', chat);

    this.chatuser = {
      name: this.account.name,
      address: this.account.address,
      fcmToken: this.fcmToken,
      fcmUid: this.fcmUid,
      time: new Date().getTime().toString()
    };

    const chatpartner = {
      name: chat.name,
      address: chat.address,
      time: new Date().getTime().toString()
    };

    this.chatService.currentChatPairId = this.chatService.createPairId(
      this.chatuser,
      chatpartner
    );

    this.chatService.currentChatPairId2 = this.chatService.createPairId2(
      this.chatuser,
      chatpartner
    );

    this.chatService.currentChatPartner = chatpartner;


    const navigationExtras: NavigationExtras = {
      queryParams: {
        sender: this.account.address,
        sendername: this.account.name,
        pair: chat.address,
        pairname: chat.name,
        index: idx
      }
    };
    this.router.navigate(['/chat-session'], navigationExtras);

  }

  async getAllAddress() {
    const alladdress = await this.addressBookSrv.getAll();
    if (alladdress) {
      this.addresses = alladdress;
    }
  }

}
