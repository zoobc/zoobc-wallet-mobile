import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FcmIdentity } from '../Interfaces/FcmIdentity';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { FIREBASE_DEVICES } from 'src/environments/variable.const';
import { Platform } from '@ionic/angular';
import { Account } from '../Interfaces/Account';
import { ChatUser } from '../Interfaces/ChatUser';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  identity: FcmIdentity;
  devicesRef = this.afs.collection('devices');
  constructor(
    private oneSignal: OneSignal,
    private platform: Platform,
    private afs: AngularFirestore) {}

  create(user: ChatUser) {
    const docId = user.token + user.path;
    return this.afs.collection(FIREBASE_DEVICES).doc(docId).set(user);
  }

  delete(token: string) {
    this.afs.collection(FIREBASE_DEVICES).doc(token).delete();
  }

  read() {
    return this.afs.collection(FIREBASE_DEVICES).snapshotChanges();
  }

  getToken(account: Account) {

    console.log('===  getToken one signal');
    let tokenPush = 'non-native';

    if (this.platform.is('cordova')) {
      this.oneSignal.getIds().then(identity => {
        console.log('===  getToken one signal', identity);
        this.identity = identity;
      });
      tokenPush = this.identity.userId;
    }

    const user: ChatUser = {
      name: account.name,
      path: account.path,
      address: account.address,
      token: tokenPush
    };

    console.log('==== will save token ==');
    this.create(user);
  }

}
