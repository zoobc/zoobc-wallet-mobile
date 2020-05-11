import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FIREBASE_CHAT } from 'src/environments/variable.const';
import { Chat, ChatUser } from '../Interfaces/chat-user';
import { AddressBookService } from './address-book.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Router } from '@angular/router';
import { ToastController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public isChatOpen = false;
  private chatLength = 0;
  private clickSub: any;
  private notifId = 1;
 

  chats: AngularFirestoreCollection<Chat>;
  currentChatPairId: string;
  currentChatPairId2: string;
  currentChatPartner: { name: any; address: any; time: string; };

  constructor(
    private db: AngularFirestore,
    private router: Router,
    private localNotifications: LocalNotifications,
    private addressBookSrv: AddressBookService,
    private toastController: ToastController,
    private platform: Platform
  ) {
    this.chats = db.collection<Chat>(FIREBASE_CHAT);
  }

  addChat(chat: Chat) {
    return this.chats.add(chat);
  }

  createPairId(user1: ChatUser, user2: { name?: any; address: any; time?: string; }) {
    const pairId = `${user1.address}|${user2.address}`;
    return pairId;
  }

  showNotif(chats: Chat[]) {
    setTimeout(() => {
      this.chat_notification(chats);
    }, 200);
  }


  unsub() {
    this.clickSub.unsubscribe();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'You receive new message.',
      duration: 2000
    });
    toast.present();
  }

  chat_notification(chats: Chat[]) {

    if (this.platform.is('cordova')) {
      this.clickSub = this.localNotifications.on('click').subscribe(data => {
        console.log(data);
        this.router.navigateByUrl('/chat');
        this.unsub();
      });
      this.localNotifications.schedule({
        id: this.notifId++,
        text: 'You have ' + (chats.length - this.chatLength) + 'chat',
        sound: 'file://sound.mp3',
        data: chats
      });
    } else {
      this.presentToast();
    }
  }

  async checkToDb(address: string) {
    const name = await this.addressBookSrv.getNameByAddress(address);
    if (!name || name === '') {
      console.log('=== checkToDb, will save to db:', address);
      // this.addressBookSrv.insert(CONST_UNKNOWN_NAME, address);
    } else {
      console.log('=== checkToDb, name is : ', name);
    }
  }

  subscribeNotif(address: string) {
    this.db
      .collection<Chat>(FIREBASE_CHAT, res => {
        return res.where('pair', '==', address).orderBy('time').limit(1000);
      }).valueChanges()
      .subscribe(chats => {

        if (chats && chats.length > 0) {
          const max = chats.length;
          if (max > this.chatLength) {

            const lastChat = chats[max - 1];
            this.checkToDb(lastChat.sender);
            if (!this.isChatOpen) {
              this.showNotif(chats);
            }

            this.chatLength = chats.length;
          }

        }

      });
  }


  createPairId2(user1: ChatUser, user2: { name?: any; address: any; time?: string; }) {
    const pairId2 = `${user2.address}|${user1.address}`;
    return pairId2;
  }

}
