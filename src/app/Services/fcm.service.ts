import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FcmIdentity } from '../Interfaces/FcmIdentity';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  identity: FcmIdentity;
  devicesRef = this.afs.collection('devices');
  constructor(private oneSignal: OneSignal, private afs: AngularFirestore) {}

  async getToken() {
    await this.oneSignal.getIds().then(identity => {
      this.identity = identity;
    });
    const tokenPush = 'telaso';

    const data = {
      token: tokenPush,
      userId: 'VertigosstUserId'
    };

    console.log('==== will save token ==');
    await this.devicesRef.doc(tokenPush).set(data);

  }

}
