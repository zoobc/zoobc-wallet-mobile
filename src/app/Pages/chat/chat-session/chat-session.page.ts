import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription} from 'rxjs';
import { ChatService } from 'src/app/Services/chat.service';
import { Chat } from 'src/app/Models/chatmodels';
import { FIREBASE_CHAT } from 'src/environments/variable.const';
import { IonContent } from '@ionic/angular';
import * as firebase from 'firebase';
import { OneSignal } from '@ionic-native/onesignal/ngx';


@Component({
  selector: 'app-chat-session',
  templateUrl: './chat-session.page.html',
  styleUrls: ['./chat-session.page.scss'],
})
export class ChatSessionPage implements OnInit {

  @ViewChild('content') content: IonContent;
  @ViewChild('chat_input') messageInput: ElementRef;

  showEmojiPicker = false;
  msgList: Array<{
    userId: any,
    userName: any,
    userAvatar: any,
    time: any,
    message: any,
    upertext: any;
  }>;

  index: number;
  sender = '';
  sendername = '';
  pair = '';
  pairname = '';

  chatId = '';
  chatcontent: string;
  created: number;
  modified: number;
  loader: boolean;
  subs: Subscription;


  public count = 0;

  newMsg: string;
  chats: any = [];
  chatpartner = this.chatService.currentChatPartner;
  chatuser;
  message: string;
  chatPayload: Chat;
  intervalScroll;

  constructor(
              public cs: ChatService,
              private oneSignal: OneSignal,
              private activeRoute: ActivatedRoute,
              private chatService: ChatService,
              private db: AngularFirestore) {


    this.activeRoute.queryParams.subscribe(params => {
      console.log('=== queryParams Params: ', params);
      this.index = params.idx;
      this.sender = params.sender;
      this.sendername = params.sendername;
      this.pair = params.pair;
      this.pairname = params.pairname;
      this.chatId = params.chatId;
      console.log('== Sender: ', this.sender);
    });

  }

  async scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(50);
    }, 400);
  }

  ngOnInit() {
    this.getFcmId();

    this.db
      .collection<Chat>(FIREBASE_CHAT, res => {
        return res.where('chatId', 'in', [this.chatService.currentChatPairId,
          this.chatService.currentChatPairId2]).orderBy('time').limit(500);
      })
      .valueChanges()
      .subscribe(chats => {
        console.log('== all chat is: ', chats);
        this.loader = true;
        this.chats = chats;
        this.scrollToBottom();
        this.loader = false;
      });
  }


  getFcmId(){
    this.oneSignal.getIds().then(identity => {
      console.log('== Fcm token: ', identity.pushToken);
      console.log('== Fcm UserId: ', identity.userId);
    });
  }


  async addChat() {
    this.loader = true;
    if (this.message && this.message !== '') {
      console.log('== Firebase time stamp: ', firebase.firestore.FieldValue.serverTimestamp());

      this.chatPayload = {
        message: this.message,
        sender: this.sender,
        pair: this.pair,
        chatId: this.chatService.currentChatPairId,
        time: firebase.firestore.FieldValue.serverTimestamp() // new Date().getTime()
      };

      await this.chatService
        .addChat(this.chatPayload)
        .then(() => {
          // Clear message box
          this.message = '';

          // Scroll to bottom
          this.scrollToBottom();
          this.loader = false;
        })
        .catch(err => {
          console.log(err);
        });

      this.scrollToBottom();
    }

  } // addChat

  isChatPartner(senderAddress) {
    return senderAddress === this.chatpartner.address;
  } // isChatPartner
}
