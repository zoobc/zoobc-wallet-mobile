import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavParams, IonContent, Events } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Subscription, Observable } from 'rxjs';
import { ChatService } from 'src/app/Services/chat.service';

@Component({
  selector: 'app-chat-session',
  templateUrl: './chat-session.page.html',
  styleUrls: ['./chat-session.page.scss'],
})
export class ChatSessionPage implements OnInit {

  @ViewChild('content') content: IonContent;
  @ViewChild('chat_input') messageInput: ElementRef;
  User = 'Me';
  toUser = 'driver';
  inp_text: any;
  editorMsg = '';
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
  public arr = [
    {
      messageId: '1',
      userId: '140000198202211138',
      userName: 'Luff',
      userImgUrl: './assets/user.jpg',
      toUserId: '210000198410281948',
      toUserName: 'Hancock',
      userAvatar: './assets/to-user.jpg',
      time: 1488349800000,
      message: 'Hey, thats an awesome chat UI',
      status: 'success'
    },
    {
      messageId: '2',
      userId: '210000198410281948',
      userName: 'Hancock',
      userImgUrl: './assets/to-user.jpg',
      toUserId: '140000198202211138',
      toUserName: 'Luff',
      userAvatar: './assets/user.jpg',
      time: 1491034800000,
      message: 'Right, it totally blew my mind. They have other great apps and designs too !',
      status: 'success'
    },
    {
      messageId: '3',
      userId: '140000198202211138',
      userName: 'Luff',
      userImgUrl: './assets/user.jpg',
      toUserId: '210000198410281948',
      toUserName: 'Hancock',
      userAvatar: './assets/to-user.jpg',
      time: 1491034920000,
      message: 'And it is free ?',
      status: 'success'
    },
    {
      messageId: '4',
      userId: '210000198410281948',
      userName: 'Hancock',
      userImgUrl: './assets/to-user.jpg',
      toUserId: '140000198202211138',
      toUserName: 'Luff',
      userAvatar: './assets/user.jpg',
      time: 1491036720000,
      message: 'Yes, totally free. Beat that ! ',
      status: 'success'
    },
    {
      messageId: '5',
      userId: '210000198410281948',
      userName: 'Hancock',
      userImgUrl: './assets/to-user.jpg',
      toUserId: '140000198202211138',
      toUserName: 'Luff',
      userAvatar: './assets/user.jpg',
      time: 1491108720000,
      message: 'Wow, thats so cool. Hats off to the developers. This is gooood stuff',
      status: 'success'
    },
    {
      messageId: '6',
      userId: '140000198202211138',
      userName: 'Luff',
      userImgUrl: './assets/user.jpg',
      toUserId: '210000198410281948',
      toUserName: 'Hancock',
      userAvatar: './assets/to-user.jpg',
      time: 1491231120000,
      message: 'Check out their other designs.',
      status: 'success'
    }
  ];

  chat$: Observable<any>;
  newMsg: string;

  constructor(private events: Events,
              public cs: ChatService,
              private route: ActivatedRoute,
              private activeRoute: ActivatedRoute,
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
      const doc = this.db.collection('chats').doc(this.sender).get();


    });



    this.msgList = [
      {
        userId: this.User,
        userName: this.User,
        userAvatar: 'assets/driver.jpeg',
        time: '12:01 pm',
        message: 'Hey, that\'s an awesome chat UI',
        upertext: 'Hello'
      },
      {
        userId: this.toUser,
        userName: this.toUser,
        userAvatar: 'assets/user.jpeg',
        time: '12:01 pm',
        message: 'Right, it totally blew my mind. They have other great apps and designs too!',
        upertext: 'Hii'
      },
      {
        userId: this.User,
        userName: this.User,
        userAvatar: 'assets/driver.jpeg',
        time: '12:01 pm',
        message: 'And it is free ?',
        upertext: 'How r u '
      },
      {
        userId: this.toUser,
        userName: this.toUser,
        userAvatar: 'assets/user.jpeg',
        time: '12:01 pm',
        message: 'Yes, totally free. Beat that !',
        upertext: 'good'
      },
      {
        userId: this.User,
        userName: this.User,
        userAvatar: 'assets/driver.jpeg',
        time: '12:01 pm',
        message: 'Wow, that\'s so cool. Hats off to the developers. This is gooood stuff',
        upertext: 'How r u '
      },
      {
        userId: this.toUser,
        userName: this.toUser,
        userAvatar: 'assets/user.jpeg',
        time: '12:01 pm',
        message: 'Check out their other designs.',
        upertext: 'good'
      },
      {
        userId: this.User,
        userName: this.User,
        userAvatar: 'assets/driver.jpeg',
        time: '12:01 pm',
        message: 'Have you seen their other apps ? They have a collection of ready-made apps for developers. This makes my life so easy. I love it! ',
        upertext: 'How r u '
      },
      {
        userId: this.toUser,
        userName: this.toUser,
        userAvatar: 'assets/user.jpeg',
        time: '12:01 pm',
        message: 'Well, good things come in small package after all',
        upertext: 'good'
      },
    ];

  }

  ngOnInit() {

    this.loadChat(this.sender);
    const source = this.cs.get(this.chatId);
    console.log('=== Doc Source: ', source);
    this.chat$ = this.cs.joinUsers(source);
  }

  loadChat(sender) {

    if (this.subs) {
      this.subs.unsubscribe();
    }

    const doc = this.db.collection('chats').doc(sender).get();
    this.subs = doc.subscribe((snapshot) => {
      const chat = snapshot.data();
      if (!chat) {
        this.chatcontent = '### This page does not exist';
      } else {
        this.chatcontent = chat.content;
        this.created = chat.created;
        this.modified = chat.modified;
        console.log(chat);
      }
    });
  }

  scrollToBottom() {
    // this.content.scrollToBottom(100);
  }

  ionViewWillLeave() {
    this.events.unsubscribe('chat:received');
  }

  ionViewDidEnter() {
    console.log('scrollBottom');
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
    console.log('scrollBottom2');
  }

  logScrollStart() {
    console.log('logScrollStart');
    document.getElementById('chat-parent');

  }

  logScrolling(event) {
    console.log('event', event);
  }


  submit(chatId) {
    this.cs.sendMessage(chatId, this.newMsg);
    this.newMsg = '';
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }


  sendMsg() {


    // let otherUser;
    // if (this.count === 0) {
    //   otherUser = this.arr[0].message;
    //   this.count++;
    // } else if (this.count == this.arr.length) {
    //   this.count = 0;
    //   otherUser = this.arr[this.count].message;
    // } else {
    //   otherUser = this.arr[this.count].message;
    //   this.count++;
    // }

    // this.msgList.push({
    //   userId: this.User,
    //   userName: this.User,
    //   userAvatar: 'assets/user.jpeg',
    //   time: '12:01 pm',
    //   message: this.inp_text,
    //   upertext: this.inp_text
    // });
    // this.msgList.push({
    //   userId: this.toUser,
    //   userName: this.toUser,
    //   userAvatar: 'assets/user.jpeg',
    //   time: '12:01 pm',
    //   message: otherUser,
    //   upertext: otherUser
    // });
    // this.inp_text = '';
    // console.log('scrollBottom');
    // setTimeout(() => {
    //   this.scrollToBottom();
    // }, 10);
  }


}
