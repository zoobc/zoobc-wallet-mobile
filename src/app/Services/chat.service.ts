import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FIREBASE_CHAT, CONST_UNKNOWN_NAME } from 'src/environments/variable.const';
import { Chat, ChatUser } from '../Interfaces/chat-user';
import { AddressBookService } from './address-book.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Router } from '@angular/router';
import { ToastController, Platform } from '@ionic/angular';
import { Contact } from '../Interfaces/contact';
import { AccountService } from './account.service';

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
    private accountService: AccountService,
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

  async findAddressInDb(address: string) {
    const name = await this.addressBookSrv.getNameByAddress(address);
    return name;
  }


  subscribeNotif(addresses: string[]) {
    this.db
      .collection<Chat>(FIREBASE_CHAT, res => {
        return res.where('pair', 'in', addresses).orderBy('time', 'desc').limit(5);
      }).valueChanges()
      .subscribe(async chats => {
        console.log('=== notif fired, chats: ', chats);
        if (chats && chats.length > 0) {
            const length = chats.length;

            console.log('=== Length: ', length);
            console.log('=== this.chatLength: ', this.chatLength);

            if (length > this.chatLength) {
              // const lastChat = chats[length - 1];
              const lastChat = chats[0];
              const name = await this.findAddressInDb(lastChat.sender);
              console.log('=== Name after fince:-', name + "-") ;
              if (!name || name === '' || name === undefined) {
                console.log('=== last chat sender:', lastChat.sender);

                const contact: Contact = { name: CONST_UNKNOWN_NAME, address: lastChat.sender};
                this.saveToDb(contact);

              } else {
                console.log('=== checkToDb, name is : ', name);
              }

              console.log('=== checkToDb, address:', lastChat.sender);
              console.log('=== checkToDb, will save to db:', name);
              // this.chatLength = chats.length;
            }
          }

      });
  }


  async saveToDb(contact: Contact) {
    await this.addressBookSrv.insert(contact);
  }

  // subscribeNotif(address: string) {
  //   this.db
  //     .collection<Chat>(FIREBASE_CHAT, res => {
  //       return res.where('pair', '==', address).orderBy('time').limit(1000);
  //     }).valueChanges()
  //     .subscribe(chats => {

  //       if (chats && chats.length > 0) {
  //         const max = chats.length;
  //         if (max > this.chatLength) {

  //           const lastChat = chats[max - 1];
  //           this.checkToDb(lastChat.sender);
  //           if (!this.isChatOpen) {
  //             // this.showNotif(chats);
  //           }

  //           this.chatLength = chats.length;
  //         }

  //       }

  //     });
  // }


  createPairId2(user1: ChatUser, user2: { name?: any; address: any; time?: string; }) {
    const pairId2 = `${user2.address}|${user1.address}`;
    return pairId2;
  }

}
