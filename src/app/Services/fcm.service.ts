import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FcmIdentity } from '../Interfaces/fcm-identity';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { FIREBASE_DEVICES } from 'src/environments/variable.const';
import { Platform } from '@ionic/angular';
import { Account } from '../Interfaces/account';
import { ChatUser } from '../Interfaces/chat-user';
import { AngularFireAuth } from '@angular/fire/auth';
import { firestore } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class FcmService {

  public userData: any;
  public chatUser: ChatUser;
  public identity: FcmIdentity;
  public isAnonymous: boolean;
  constructor(
    public ngFireAuth: AngularFireAuth,
    private oneSignal: OneSignal,
    private platform: Platform,
    private afs: AngularFirestore) {
      this.initialize();
    }

  async create(user: ChatUser) {
    const docId = user.uid + user.path;
    let result = null;
    try {
      result = await this.afs.collection(FIREBASE_DEVICES).doc(docId).update(user);
    } catch (e) {
      result = await this.afs.collection(FIREBASE_DEVICES).doc(docId).set(user);
    }
    return result;
   }

  async initialize() {


    if (this.userData) {
      return;
    }

    await this.ngFireAuth.auth.signInAnonymously().then(userx => {
      this.userData = userx;
    }).catch( error =>{
      const errorCode = error.code;
      const errorMessage = error.message;
    });

    this.ngFireAuth.authState.subscribe(userx => {
      if (userx) {
        this.userData = userx;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  delete(user: ChatUser) {
    const docId = user.uid + user.path;
    this.afs.collection(FIREBASE_DEVICES).doc(docId).delete();
  }

  read() {
    return this.afs.collection(FIREBASE_DEVICES).snapshotChanges();
  }

  async getToken(account: Account) {
    this.identity = {
      userId: 'non-native-id',
      pushToken: 'non-native-token'
    };

    if (this.platform.is('cordova')) {
      await this.oneSignal.getIds().then(identity => {
        this.identity = identity;
      });
    }

    const user: ChatUser = {
      name: account.name,
      path: account.path,
      address: account.address,
      token: this.identity.pushToken,
      uid: this.identity.userId,
      time: firestore.FieldValue.serverTimestamp()
    };

    this.chatUser =  user;
    this.create(user);
  }

}
