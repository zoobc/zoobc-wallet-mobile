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
import { ChatUser } from 'src/app/Interfaces/chat-user';
import { FcmService } from 'src/app/Services/fcm.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  chatGroup: any;
  chatContent: string;
  addresses = [];
  account: Account;
  chatuser: ChatUser;
  fcmToken: string;
  fcmUid: string;
  recentChats: any;
  chatSenders: any;

  constructor(private router: Router,
              private fcmService: FcmService,
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
    const identity = this.fcmService.identity;
    this.fcmUid = identity.userId;
    this.fcmToken = identity.pushToken;
  }

  segmentChanged(ev: any) {
  }

  ngOnInit() {
    this.chatContent =  'chats';
    this.recentChats = this.chatService.recentCats;

    if (this.recentChats && this.recentChats.length > 0) {
      this.chatGroup = this.groupBy(this.recentChats, 'sender');
      this.chatSenders = Object.keys(this.chatGroup);
    }
    this.getFcmId();
    this.loadAccount();
    this.getAllAddress();
  }

  openChatSession(address: string, name: string) {

    this.chatuser = {
      name: this.account.name,
      address: this.account.address,
      token: this.fcmToken,
      uid: this.fcmUid,
      path: -1,
      time: new Date().getTime().toString()
    };

    const chatPair = {
      name,
      address,
      time: new Date().getTime().toString()
    };

    this.chatService.currentChatPairId = this.chatService.createPairId(
      this.chatuser,
      chatPair
    );

    this.chatService.currentChatPairId2 = this.chatService.createPairId2(
      this.chatuser,
      chatPair
    );

    this.chatService.currentChatPartner = chatPair;


    const navigationExtras: NavigationExtras = {
      queryParams: {
        sender: this.account.address,
        sendername: this.account.name,
        pair: chatPair.address,
        pairname: chatPair.name
      }
    };
    this.router.navigate(['/chat-session'], navigationExtras);

  }

  groupBy(xs, key) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  async showSession(idx: number) {

    const contactPair = this.addresses[idx];
    this.chatuser = {
      name: this.account.name,
      address: this.account.address,
      token: this.fcmToken,
      uid: this.fcmUid,
      path: -1,
      time: new Date().getTime().toString()
    };

    const chatPair = {
      name: contactPair.name,
      address: contactPair.address,
      time: new Date().getTime().toString()
    };

    this.chatService.currentChatPairId = this.chatService.createPairId(
      this.chatuser,
      chatPair
    );

    this.chatService.currentChatPairId2 = this.chatService.createPairId2(
      this.chatuser,
      chatPair
    );

    this.chatService.currentChatPartner = chatPair;


    const navigationExtras: NavigationExtras = {
      queryParams: {
        sender: this.account.address,
        sendername: this.account.name,
        pair: chatPair.address,
        pairname: chatPair.name,
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
