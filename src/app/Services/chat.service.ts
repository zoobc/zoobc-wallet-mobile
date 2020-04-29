import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FIREBASE_CHAT, FIREBASE_CHAT_USER } from 'src/environments/variable.const';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { firestore } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { User, Chat } from '../Models/chatmodels';

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



  // ====

  users: AngularFirestoreCollection<User>;
  private userDoc: AngularFirestoreDocument<User>;

  chats: AngularFirestoreCollection<Chat>;
  private chatDoc: AngularFirestoreDocument<Chat>;

  //The pair string for the two users currently chatting
  currentChatPairId;
  currentChatPairId2;
  currentChatPartner;

  constructor(private db: AngularFirestore) {
    //Get the tasks collecction
    this.users = db.collection<User>(FIREBASE_CHAT_USER);
    this.chats = db.collection<Chat>(FIREBASE_CHAT);
  }

  addUser(payload) {
    return this.users.add(payload);
  }

  addChat(chat: Chat) {
    return this.chats.add(chat);
  }

  createPairId(user1, user2) {
    const pairId = `${user1.address}|${user2.address}`;
    return pairId;
  }

  createPairId2(user1, user2) {
    const pairId2 = `${user2.address}|${user1.address}`;
    return pairId2;
  }

}
