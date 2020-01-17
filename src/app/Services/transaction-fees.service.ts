import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TransactionFeesService {

  constructor( private firestore: AngularFirestore) { 

  }

  readTrxFees() {
    return this.firestore.collection('transactionfees').snapshotChanges();
  }

  readZbcRate() {
    return this.firestore.collection('currencyRate').snapshotChanges();
  }
}
