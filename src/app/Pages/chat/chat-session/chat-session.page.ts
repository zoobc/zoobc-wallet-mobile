import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription} from 'rxjs';
import { ChatService } from 'src/app/Services/chat.service';
import { Chat } from 'src/app/Models/chatmodels';
import { FIREBASE_CHAT } from 'src/environments/variable.const';

@Component({
  selector: 'app-chat-session',
  templateUrl: './chat-session.page.html',
  styleUrls: ['./chat-session.page.scss'],
})
export class ChatSessionPage implements OnInit {

  // @ViewChild('content') content: IonContent;
  @ViewChild('content') content: any;
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

  subs: Subscription;

  private msgDbref: any;
  private messageList = [];
  private inputMessage = '';

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

  ngOnInit() {

    console.log(' ====== current chart PairID:  ', this.chatService.currentChatPairId);
    console.log(' ====== current chart PairID2:  ', this.chatService.currentChatPairId2);

    this.db
      .collection<Chat>(FIREBASE_CHAT, res => {
        return res.where('pair', 'in', [this.chatService.currentChatPairId, this.chatService.currentChatPairId2]);
      })
      .valueChanges()
      .subscribe(chats => {
        console.log('== all chat is: ', chats);
        this.chats = chats;
      });
  }



  addChat() {


    if (this.message && this.message !== '') {
      console.log('== Message: ', this.message);

      this.chatPayload = {
        message: this.message,
        sender: this.sender,
        pair: this.chatService.currentChatPairId,
        time: new Date().getTime()
      };

      this.chatService
        .addChat(this.chatPayload)
        .then(() => {
          // Clear message box
          this.message = '';

          // Scroll to bottom
          this.content.scrollToBottom(300);
        })
        .catch(err => {
          console.log(err);
        });
    }

  } // addChat

  isChatPartner(senderAddress) {
    return senderAddress === this.chatpartner.address;
  } // isChatPartner
}
