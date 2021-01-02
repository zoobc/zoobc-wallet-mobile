import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';
import { base64ToByteArray } from 'src/Helpers/converters';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { Router } from '@angular/router';
import { QrScannerService } from 'src/app/Services/qr-scanner.service';

@Component({
  selector: 'app-form-address',
  templateUrl: './form-address.component.html',
  styleUrls: ['./form-address.component.scss']
})
export class FormAddressComponent implements OnInit, OnChanges {

  @Input() mode = 'add';
  @Input() addressId: number | null = null;
  @Input() value: { name: string; address: string } | null = null;
  @Output() onSubmit = new EventEmitter();

  addresses = [];
  submitted = false;
  constructor(
    private addressBookSrv: AddressBookService,
    private router: Router,
    private qrScannerSrv: QrScannerService
  ) {

    this.qrScannerSrv.qrScannerSubject.subscribe((address) => {
      this.getScannerResult(address);
    });

  }

  formAddress = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(66),
      bytesLengthValidator
    ])
  });

  ngOnChanges() {
    if (this.value) {
      this.formAddress.controls['name'].setValue(this.value.name);
      this.formAddress.controls['address'].setValue(this.value.address);
    }
  }

  async submit() {
    this.submitted = true;

    let oldValue: any | null = null;
    if (this.addressId !== null) {
      oldValue = await this.addressBookSrv.getOneByIndex(this.addressId);
    }

    const nameExists = this.isNameExists(this.name.value);
    if (
      (oldValue !== null && oldValue.name !== this.name.value && nameExists) ||
      (oldValue === null && nameExists)
    ) {
      this.formAddress.controls['name'].setErrors({ nameExists });
    }

    const addressExists = this.isAddressExists(this.address.value);
    if (
      (oldValue !== null &&
        oldValue.address !== this.address.value &&
        addressExists) ||
      (oldValue === null && addressExists)
    ) {
      this.formAddress.controls['address'].setErrors({
        addressExists
      });
    }

    if (this.formAddress.valid) {
      this.onSubmit.emit(this.formAddress.value);
    }
  }

  isNameExists(name: string) {
    let address = '';
    if (
      this.addresses.findIndex(addrs => {
        address = addrs.address;
        return addrs.name === name;
      }) >= 0
    ) {
      return 'Name is exist, with address: ' + address;
    }

    return null;
  }

  isAddressExists(addressValue: string) {
    let name = '';
    if (
      this.addresses.findIndex(addrs => {
        name = addrs.name;
        return addrs.address === addressValue;
      }) >= 0
    ) {
      return 'Address is exist, with name: ' + name;
    }

    return null;
  }

  ngOnInit() {
    this.getAllAddress();
  }

  async getAllAddress() {
    const alladdress = await this.addressBookSrv.getAll();
    if (alladdress) {
      this.addresses = alladdress;
    }
  }

  get name() {
    return this.formAddress.get('name');
  }

  get address() {
    return this.formAddress.get('address');
  }

  scanQRCode() {
    this.router.navigateByUrl('/scanqr-for-addressbook');
  }

  getScannerResult(jsondata: string) {
    if (jsondata==null) {
      console.log("json data null");
    }
    if (jsondata && jsondata.length > 0) {
      const result = jsondata.split('||');
      this.formAddress.controls['address'].setValue(result[0]);
    }
  }
}

function bytesLengthValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  return base64ToByteArray(control.value).length !== 49
    ? { bytesLength: true }
    : null;
}
