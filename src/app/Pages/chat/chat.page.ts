import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Services/auth-service';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { ChatService } from 'src/app/Services/chat.service';
import { User } from 'src/app/Models/chatmodels';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  addresses = [];
  account: Account;
  email = '';
  chatuser: User;

  constructor(private router: Router,
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


  ngOnInit() {
    this.loadAccount();
    this.getAllAddress();
    console.log('---- All address in chat---- :', this.addresses);
  }

  async showSession(idx: number) {
    firebase.auth().signInAnonymously();

    firebase.auth().onAuthStateChanged(firebaseUser => {
      console.log('Firebase User: ', firebaseUser);
    });

    const chat = this.addresses[idx];
    console.log('... di session ', chat);

    this.chatuser = {
      name: this.account.name,
      address: this.account.address,
      email: '',
      time: new Date().getTime().toString()
    };

    const chatpartner = {
      name: chat.name,
      address: chat.address,
      email: '',
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
