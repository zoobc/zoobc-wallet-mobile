// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

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
  // tslint:disable-next-line:no-output-on-prefix
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
      this.formAddress.controls.name.setValue(this.value.name);
      this.formAddress.controls.address.setValue(this.value.address);
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
      this.formAddress.controls.name.setErrors({ nameExists });
    }

    const addressExists = this.isAddressExists(this.address.value);
    if (
      (oldValue !== null &&
        oldValue.address !== this.address.value &&
        addressExists) ||
      (oldValue === null && addressExists)
    ) {
      this.formAddress.controls.address.setErrors({
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
    if (jsondata == null) {
      console.log('json data null');
    }
    if (jsondata && jsondata.length > 0) {
      const result = jsondata.split('||');
      this.formAddress.controls.address.setValue(result[0]);
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
