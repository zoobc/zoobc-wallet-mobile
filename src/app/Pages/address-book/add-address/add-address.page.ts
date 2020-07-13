import { Component, OnInit } from '@angular/core';
import { base64ToByteArray, makeShortAddress } from 'src/Helpers/converters';
import { ActivatedRoute, Router } from '@angular/router';
import { QrScannerService } from 'src/app/Services/qr-scanner.service';
import { MODE_EDIT, MODE_NEW } from 'src/environments/variable.const';
import { sanitizeString } from 'src/Helpers/utils';
import { Contact } from 'src/app/Interfaces/contact';
import { AddressBookService } from 'src/app/Services/address-book.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {

  name: string;
  address: string;
  oldName: string;
  oldAddress: string;
  mode: string;
  index: number;
  addresses = [];
  isAddressValid = true;
  isNameValid = true;
  validationMessage = '';

  constructor(
    private addressBookSrv: AddressBookService,
    private qrScannerSrv: QrScannerService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }


  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      if (params && params.mode === MODE_EDIT) {
        this.name = params.name;
        this.address = params.address;
        this.oldName = params.name;
        this.oldAddress = params.address;
      }
      this.index = params.index;
      this.mode = params.mode;
    });
    this.getAllAddress();
  }

  async getAllAddress() {
    const alladdress = await this.addressBookSrv.getAll();
    if (alladdress) {
      this.addresses = alladdress;
    }
  }

  isNameExists(name: string, address: string) {
    this.validationMessage = '';
    let finded = false;
    this.addresses.forEach(obj => {
      if (String(name).valueOf() === String(obj.name).valueOf() &&
        String(address).valueOf() !== String(obj.address).valueOf()) {
        this.validationMessage = 'Name is exist, with address: ' + obj.address ;
        finded = true;
      }
    });

    return finded;
  }


  isAddressExists(address: string, name: string) {
    this.validationMessage = '';
    let finded = false;

    this.addresses.forEach(obj => {
      if (String(address).valueOf() === String(obj.address).valueOf()) {
        this.validationMessage = 'Address is exist, with name: ' + obj.name;
        finded = true;
      }
    });
    return finded;
  }

  scanQRCode() {
    this.router.navigateByUrl('/scanqr-for-addressbook');

    this.qrScannerSrv.listen().subscribe((jsondata: string) => {
      const data = JSON.parse(jsondata);
      this.address = data.address;
    });
  }

  sanitize() {
    this.name = sanitizeString(this.name);
    this.address = sanitizeString(this.address);
  }

  async saveAddress() {

    // console.log('======= saveAddress Mode: ', this.mode);
    this.isAddressValid = true;
    this.isNameValid = true;

    if (!this.name) {
      // console.log('== name is empty');
      this.validationMessage = 'Name is empty';
      this.isNameValid = false;
      return;
    }

    if (this.mode === MODE_EDIT) {

      // check if nothing changed
      if (this.name === this.oldName) {
        // console.log('Nothing changed ');
        this.goListAddress();
        return;
      }

      // check if name exists
      if (this.isNameExists(this.name, this.address)) {
        // console.log('== name exist: ', this.name);
        this.validationMessage = 'Name is Exists';
        this.isNameValid = false;
        return;
      }

      // upddate data
      if (this.isNameValid) {

        const contact: Contact = {
          name: this.name,
          address: sanitizeString(this.address),
          shortAddress: makeShortAddress(sanitizeString(this.address))
        };

        await this.addressBookSrv.updateByIndex(contact,
          this.index
        );
        this.goListAddress();
      }

    } else if (this.mode === MODE_NEW) {

      if (this.isNameExists(this.name, this.address)) {
        // console.log('== name exist: ', this.name);
        this.validationMessage = 'Name is exists';
        this.isNameValid = false;
        return;
      }

      if (!this.address) {
        this.validationMessage = 'Address is empty';
        this.isAddressValid = false;
        return;
      }

      if (this.address.length !== 44) {
        this.validationMessage = 'Address is not valid!';
        this.isAddressValid = false;
        return;
      }

      const addressBytes = base64ToByteArray(this.address);
      if (addressBytes.length !== 33) {
        this.isAddressValid = false;
        this.validationMessage = 'Address is not valid!';
        return;
      }

      if (this.isAddressExists(this.address, this.name)) {
        this.isAddressValid = false;
        return;
      }

      if (this.isAddressValid && this.isNameValid) {
        const contact: Contact = {
          name: this.name,
          address: sanitizeString(this.address),
          shortAddress: makeShortAddress(sanitizeString(this.address))
        };

        await this.addressBookSrv.insert(contact);
        this.goListAddress();
        return;
      }

    }

  }

  goListAddress() {
    this.router.navigateByUrl('/address-book');
  }

  cancel() {
    this.goListAddress();
  }
}