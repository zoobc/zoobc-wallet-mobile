import { Component, OnInit } from '@angular/core';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { base64ToByteArray } from 'src/app/Helpers/converters';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { QrScannerService } from 'src/app/Pages/qr-scanner/qr-scanner.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {

  name: string;
  address: string;
  mode: string;
  index: number;
  addresses = [];
  isAddressValid = true;
  validationMessage = '';

  constructor(
    private addressBookSrv: AddressBookService,
    private qrScannerSrv: QrScannerService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }


  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      console.log('=== Params: ', params);
      this.index = params.index;
      this.mode = params.mode;
      this.name = params.name;
      this.address = params.address;
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
    let i = 0;
    this.addresses.forEach(obj => {
      if (String(name).valueOf() === String(obj.name).valueOf()) {
        this.validationMessage = '<p>Name is exist, with address:<br/>' + obj.address + '</p>';
        if (this.mode === 'edit') {

          if (String(address).valueOf() !== String(obj.address).valueOf()){
            finded = true;
          }

          // if (i !== this.index) {
          //   finded = true;
          // }
        } else {
          finded = true;
        }
      }
      i++;
    });

    return finded;
  }


  isAddressExists(address: string, name: string) {
    this.validationMessage = '';
    let finded = false;

    let i = 0;
    this.addresses.forEach(obj => {
      if (String(address).valueOf() === String(obj.address).valueOf()) {
        this.validationMessage = '<p>Address is exist, with name:<br/>' + obj.name + '</p>';
        if (this.mode === 'edit') {

          if (String(name).valueOf() !== String(obj.name).valueOf()){
            finded = true;
          }

          // if (i !== this.index) {
          //   finded = true;
          // }

        } else {
          finded = true;
        }
      }
      i++;
    });
    return finded;
  }

  scanQRCode() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
          from: JSON.stringify('addressbook')
      }
    };

    this.router.navigateByUrl('/qr-scanner', navigationExtras);
    this.qrScannerSrv.listen().subscribe( (addrss: string) => {
        this.address = addrss;
    });
  }

  async saveAddress() {
    console.log('======= saveAddress Mode: ', this.mode);
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

    if (this.isNameExists(this.name, this.address)) {
      console.log('== name exist: ', this.name);
      this.isAddressValid = false;
      return;
    }

    if (this.isAddressExists(this.address, this.name)) {
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

      this.router.navigateByUrl('/address-book');
    }
  }

}
