import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  create(record: any) {
    return this.firestore.collection('feedbackform').add(record);
  }

  read() {
    return this.firestore.collection('feedbackform').snapshotChanges();
  }

  update(recordID: any, record: any){
    this.firestore.doc('feedbackform/' + recordID).update(record);
  }

  delete(recordID: any) {
    this.firestore.doc('feedbackform/' + recordID).delete();
  }

}
