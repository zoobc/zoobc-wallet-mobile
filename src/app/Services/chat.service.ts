import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FIREBASE_CHAT } from 'src/environments/variable.const';
import { Chat, ChatUser } from '../Interfaces/chat-user';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // constructor(
  //   private afAuth: AngularFireAuth,
  //   private afs: AngularFirestore,
  //   private router: Router
  // ) { }


  // async create() {
  //   const { uid } = await firebase.auth().currentUser;
  //   const data = {
  //     uid,
  //     createdAt: Date.now(),
  //     count: 0,
  //     messages: []
  //   };

  //   const docRef = await this.afs.collection(FIREBASE_CHAT).add(data);

  //   return docRef;
  // }

  // async sendMessage(chatId, content) {
  //   const { uid } = await firebase.auth().currentUser;

  //   const data = {
  //     uid,
  //     content,
  //     createdAt: Date.now()
  //   };

  //   if (uid) {
  //     const ref = this.afs.collection(FIREBASE_CHAT).doc(chatId);
  //     return ref.update({
  //       messages: firestore.FieldValue.arrayUnion(data)
  //     });
  //   }
  // }

  // private updateUserData({ uid, email, displayName, photoURL }) {
  //   const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);

  //   const data = {
  //     uid,
  //     email,
  //     displayName,
  //     photoURL
  //   };

  //   return userRef.set(data, { merge: true });
  // }

  chats: AngularFirestoreCollection<Chat>;
  currentChatPairId: string;
  currentChatPairId2: string;
  currentChatPartner: { name: any; address: any; time: string; };

  constructor(db: AngularFirestore) {
    // Get the tasks collecction
    // this.users = db.collection<ChatUser>(FIREBASE_CHAT_USER);
    this.chats = db.collection<Chat>(FIREBASE_CHAT);
  }

  addChat(chat: Chat) {
    return this.chats.add(chat);
  }

  createPairId(user1: ChatUser, user2: { name?: any; address: any; time?: string; }) {
    const pairId = `${user1.address}|${user2.address}`;
    return pairId;
  }

  createPairId2(user1: ChatUser, user2: { name?: any; address: any; time?: string; }) {
    const pairId2 = `${user2.address}|${user1.address}`;
    return pairId2;
  }

}
