import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { STORAGE_ADDRESS_BOOK, FIREBASE_ADDRESS_BOOK, CONST_UNKNOWN_NAME } from 'src/environments/variable.const';
import { StoragedevService } from './storagedev.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { sanitizeString } from 'src/Helpers/utils';
import { Contact } from '../Interfaces/contact';

@Injectable({
  providedIn: 'root'
})

export class AddressBookService {
  counter = 0;
  private selectedAddress: string;
  private addresses: any;

  public addressSubject: Subject<string> = new Subject<string>();

  public getSelectedAddress() {
    return this.selectedAddress;
  }
  public setSelectedAddress(value) {
    this.selectedAddress = value;
    this.addressSubject.next(this.selectedAddress);
  }

  constructor(
    private strgSrv: StoragedevService,
    private afs: AngularFirestore) {
    this.selectedAddress = '';
    this.addresses = this.getAll();
  }

  getAll() {
    return this.strgSrv.get(STORAGE_ADDRESS_BOOK).catch(error => {
      console.log(error);
    });
  }

   async getNameByAddress(address: string) {
     let name = '';
     await this.addresses.then(addresses => {
       if (addresses && addresses.length > 0) {
          addresses.forEach((obj: { name: any; address: string; }) => {
              if (String(address).valueOf() === String(obj.address).valueOf()) {
                name = obj.name;
              }
            });
     }});
     return name;
  }


  async updateByIndex(contact: Contact, idx: number) {
    const allAddress = await this.getAll();
    allAddress[idx] = contact;
    await this.update(allAddress);
  }

  async insertBatch(addresses) {
    this.addresses = [];

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < addresses.length; i++) {
      const dt  = addresses[i];
      this.addresses.push({
        name: sanitizeString(dt.name),
        address: dt.address
      });
    }

    await this.update(this.addresses);
  }

  async insert(contact: Contact) {
    let allAddress = await this.getAll();
    if (!allAddress) {
      allAddress = [];
    }

    let name = contact.name;
    const newAddress =  allAddress.slice();

    if (CONST_UNKNOWN_NAME === name ) {
      name = CONST_UNKNOWN_NAME + '-' + (allAddress.length + 1);
    }
    contact.name = name;
    newAddress.push(contact);

    await this.update(newAddress);
  }

  async update(addresses: any) {
    this.addresses = addresses;
    await this.strgSrv.set(STORAGE_ADDRESS_BOOK, addresses);
  }


  createBackup(mainAcc: string, obj: any) {
      return this.afs.collection(FIREBASE_ADDRESS_BOOK).doc(mainAcc).set(obj, { merge: true });
  }

  read_backup() {
    return this.afs.collection(FIREBASE_ADDRESS_BOOK).snapshotChanges();
  }

  restoreBackup(mainAcc: string) {
    return this.afs.collection(FIREBASE_ADDRESS_BOOK).doc(mainAcc).ref.get();
  }

  delete_backup(mainAcc: string) {
    this.afs.collection(FIREBASE_ADDRESS_BOOK).doc(mainAcc).delete();
  }


  registerUser(value) {
    return new Promise<any>((resolve, reject) => {
      auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err));
    });
  }

  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      auth().signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err));
    });
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (auth().currentUser) {
        auth().signOut()
          .then(() => {
            console.log('LOG Out');
            resolve();
          }).catch((error) => {
            reject();
          });
      }
    });
  }

  userDetails() {
    return auth().currentUser;
  }


}
