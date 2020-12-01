import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription} from 'rxjs';
import { ChatService } from 'src/app/Services/chat.service';
import { Chat } from 'src/app/Interfaces/chat-user';
import { FIREBASE_CHAT, FIREBASE_DEVICES } from 'src/environments/variable.const';
import { IonContent } from '@ionic/angular';
import { firestore } from 'firebase/app';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { ChatUser } from 'src/app/Interfaces/chat-user';

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

  // index: number;
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
  chatuser: any;
  message: string;
  chatPayload: Chat;
  intervalScroll: any;

  constructor(
              public cs: ChatService,
              private oneSignal: OneSignal,
              private activeRoute: ActivatedRoute,
              private chatService: ChatService,
              private db: AngularFirestore) {


  }

  async scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(50);
    }, 1000);
  }


  getPairToken(pair: string) {
    this.db
      .collection<ChatUser>(FIREBASE_DEVICES, res => {
        return res.where('address', '==', pair).orderBy('time').limit(10);
      })
      .valueChanges()
      .subscribe(chats => {
        this.loader = true;
        this.chats = chats;
        this.scrollToBottom();
        this.loader = false;
      });
  }

  ionViewDidLeave() {
    this.chatService.isChatOpen = false;
  }


  ngOnInit() {


    this.activeRoute.queryParams.subscribe(params => {
      this.sender = params.sender;
      this.sendername = params.sendername;
      this.pair = params.pair;
      this.pairname = params.pairname;
      this.chatId = params.chatId;
    });

    this.chatService.isChatOpen =  true;

    this.getFcmId();
    this.db
      .collection<Chat>(FIREBASE_CHAT, res => {
        return res.where('chatId', 'in', [this.chatService.currentChatPairId,
          this.chatService.currentChatPairId2]).orderBy('time').limit(1000);
      })
      .valueChanges()
      .subscribe(chats => {
        this.loader = true;
        this.chats = chats;
        this.scrollToBottom();
        this.loader = false;
      });
  }


  getFcmId() {
    this.oneSignal.getIds().then(identity => {

    });
  }


  async addChat() {
    this.loader = true;
    if (this.message && this.message !== '') {
      this.chatPayload = {
        message: this.message,
        sender: this.sender,
        pair: this.pair,
        chatId: this.chatService.currentChatPairId,
        time: firestore.FieldValue.serverTimestamp() // new Date().getTime()
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
