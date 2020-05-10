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
  //  uid: string;
  userData: any;
  chatUser: ChatUser;
  identity: FcmIdentity;
  isAnonymous: boolean;
  constructor(
    public ngFireAuth: AngularFireAuth,
    private oneSignal: OneSignal,
    private platform: Platform,
    private afs: AngularFirestore) {
      this.initialize();
    }

  create(user: ChatUser) {
    const docId = user.uid + user.path;
    return this.afs.collection(FIREBASE_DEVICES).doc(docId).update(user);
  }

  async initialize() {


    if (this.userData) {
      return;
    }

    await this.ngFireAuth.auth.signInAnonymously().then(userx => {
      console.log('===== fcm user success: ', userx);
      this.userData = userx;
    }).catch( error =>{
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('======== fcm errorCode: ', errorCode);
      console.log('======== fcm  errorMessage: ', errorMessage);
    });

    this.ngFireAuth.authState.subscribe(userx => {
      console.log('===== fcm user changed 1: ', userx);
      // this.presentAlertSuccess('UserId: ' + userx.uid);
      if (userx) {
        this.userData = userx;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });

    // this.ngFireAuth.auth.onAuthStateChanged(userx => {
    //   console.log('===== fcm user changed 2: ', userx);
    // });

  }

  // async presentAlertSuccess(msg: string) {
  //   const alert = await this.alertController.create({
  //     header: 'Info',
  //     subHeader: 'Escrow approval success',
  //     message: msg,
  //     buttons: ['OK']
  //   });
  //   await alert.present();
  // }


  delete(user: ChatUser) {
    const docId = user.uid + user.path;
    this.afs.collection(FIREBASE_DEVICES).doc(docId).delete();
  }

  read() {
    return this.afs.collection(FIREBASE_DEVICES).snapshotChanges();
  }

  async getToken(account: Account) {

    console.log('getToken Account: ', account);
    console.log('===  getToken one signal');
    this.identity = {
      userId: 'non-native-id',
      pushToken: 'non-native-token'
    };

    if (this.platform.is('cordova')) {
      await this.oneSignal.getIds().then(identity => {
        console.log('===  getToken one signal', identity);
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
