import { Component, OnInit } from '@angular/core';
import { makeShortAddress } from 'src/Helpers/converters';
import { sanitizeString } from 'src/Helpers/utils';
import { Contact } from 'src/app/Interfaces/contact';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html'
})
export class AddAddressPage implements OnInit {
  constructor(
    private addressBookSrv: AddressBookService,
    private navCtrl: NavController
  ) {}

  async onSubmit(value: any) {
    const { name, address } = value;

    const contact: Contact = {
      name: name,
      address: sanitizeString(address),
      shortAddress: makeShortAddress(sanitizeString(address))
    };

    await this.addressBookSrv.insert(contact);
    this.navCtrl.pop();
  }

  ngOnInit() {}
}
