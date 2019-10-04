import { Component, OnInit } from '@angular/core';
import { AddressBookService } from 'src/app/services/address-book.service';
import { ModalController, NumericValueAccessor } from '@ionic/angular';
import { base64ToByteArray } from 'src/app/helpers/converters';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-address-book-form',
  templateUrl: './address-book-form.component.html',
  styleUrls: ['./address-book-form.component.scss']
})
export class AddressBookFormComponent implements OnInit {
  name: string;
  address: string;
  mode: string;
  index: number;
  addresses = [];
  isAddressValid = true;
  validationMessage = '';

  constructor(
    private addressBookSrv: AddressBookService,
    private qrScanner: QRScanner,
    private modalController: ModalController
  ) { }

  closeModal() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  async ngOnInit() {
    this.getAllAddress();
  }

  async getAllAddress() {
    const alladdress = await this.addressBookSrv.getAll();
    if (alladdress) {
      this.addresses = alladdress;
    }
  }

  isNameExists(name: string) {
    this.validationMessage = '';
    let finded = false;
    let i = 0;
    this.addresses.forEach(obj => {
      if (String(name).valueOf() === String(obj.name).valueOf()) {
        this.validationMessage = '<p>Name is exist, with address:<br/>' + obj.address + '</p>';
        if (this.mode === 'edit') {
          if (i !== this.index) {
            finded = true;
          }
        } else {
          finded = true;
        }
      }
      i++;
    });

    return finded;
  }

  isAddressExists(address: string) {
    this.validationMessage = '';
    let finded = false;

    let i = 0;
    this.addresses.forEach(obj => {
      if (String(address).valueOf() === String(obj.address).valueOf()) {
        this.validationMessage = '<p>Address is exist, with name:<br/>' + obj.name + '</p>';
        if (this.mode === 'edit') {
          if (i !== this.index) {
            finded = true;
          }
        } else {
          finded = true;
        }
      }
      i++;
    });
    return finded;
  }

  scanQRCode() {

    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          const scanSub = this.qrScanner.scan().subscribe(async (text: string) => {
            this.qrScanner.hide().then();
            scanSub.unsubscribe();
          });

          this.qrScanner.show().then();

        } else if (status.denied) {
          this.qrScanner.openSettings();
        } else {
          //
        }
      }).catch((e: any) => {
        alert(e);
        console.log('Error is', e);
      });

  }

  async addAddress() {
    this.isAddressValid = true;
    if (!this.name) {
      console.log('== name is empty');
      this.validationMessage = 'Name is empty';
      this.isAddressValid = false;
      return;
    }

    if (!this.address) {
      console.log('== name exist: ', this.name);
      this.validationMessage = 'Address is empty';
      this.isAddressValid = false;
      return;
    }

    if (this.address.length !== 44) {
      console.log('== name exist: ', this.name);
      this.validationMessage = 'Address is not valid';
      this.isAddressValid = false;
      return;
    }

    const addressBytes = base64ToByteArray(this.address);
    if (addressBytes.length !== 33) {
      this.isAddressValid = false;
      this.validationMessage = 'Address is not valid!';
      return;
    }

    if (this.isNameExists(this.name)) {
      console.log('== name exist: ', this.name);
      this.isAddressValid = false;
      return;
    }

    if (this.isAddressExists(this.address)) {
      console.log('== Address exist: ', this.address);
      this.isAddressValid = false;
      return;
    }

    if (this.isAddressValid) {

      if (this.mode === 'edit') {
        await this.addressBookSrv.updateByIndex(
          this.name,
          this.address,
          this.index
        );
      } else {
        await this.addressBookSrv.insert(
          this.name,
          this.address
        );
      }

      this.modalController.dismiss(
        { name: this.name, address: this.address }
      );
    }
  }
}