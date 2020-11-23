import { Component, OnInit } from '@angular/core';
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
      name,
      address: (address)
    };

    await this.addressBookSrv.insert(contact);
    this.goBack();
  }

  ngOnInit() {}

  goBack() {
    this.navCtrl.navigateBack('/address-book');
  }
}
