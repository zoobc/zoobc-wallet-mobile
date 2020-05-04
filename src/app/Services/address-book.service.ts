import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { STORAGE_ADDRESS_BOOK, FIREBASE_ADDRESS_BOOK } from 'src/environments/variable.const';
import { StoragedevService } from './storagedev.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})

export class AddressBookService {

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

  async getAll() {
    return await this.strgSrv.get(STORAGE_ADDRESS_BOOK).catch(error => {
      console.log(error);
    });
  }

  async getNameByAddress(address: string) {
    let name = '';
    this.addresses.forEach((obj: { name: any; address: string; }) => {
      if (String(address).valueOf() === String(obj.address).valueOf()) {
        name = obj.name;
      }
    });
    return name;
  }


  async updateByIndex(name: string, address: string, idx: number) {
    const allAddress = await this.getAll();
    allAddress[idx] = {
      name,
      address,
      created: new Date()
    };
    await this.update(allAddress);
  }

  async insertBatch(addresses) {
    this.addresses = [];
    // const c = await this.getAll();
    // if (c) {
    //   this.addressess.push(c.slice());
    // }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < addresses.length; i++) {
      const dt  = addresses[i];
      this.addresses.push({
          name: dt.name,
          address: dt.address,
          created: dt.created
      });
    }

    await this.update(this.addresses);
  }

  async insert(name: string, address: string, created: any) {
    let crtd = new Date();
    if (created !== null) {
      crtd = created;
    }
    let allAddress = await this.getAll();
    if (!allAddress) {
      allAddress = [];
    }

    const newAddress =  allAddress.slice();
    newAddress.push({
      name,
      address,
      created: crtd
    });

    await this.update(newAddress);
  }

  async update(addresses: any) {
    this.addresses = addresses;
    await this.strgSrv.set(STORAGE_ADDRESS_BOOK, addresses);
  }


  create_backup(mainAcc: string, obj: any) {
    return this.afs.collection(FIREBASE_ADDRESS_BOOK).doc(mainAcc).set(obj);
  }

  read_backup() {
    return this.afs.collection(FIREBASE_ADDRESS_BOOK).snapshotChanges();
  }

  restore_backup(mainAcc: string) {
    return this.afs.collection(FIREBASE_ADDRESS_BOOK).doc(mainAcc).ref.get();
  }

  delete_backup(mainAcc: string) {
    this.afs.collection(FIREBASE_ADDRESS_BOOK).doc(mainAcc).delete();
  }


  registerUser(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err));
    });
  }

  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err));
    });
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut()
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
    return firebase.auth().currentUser;
  }


}
