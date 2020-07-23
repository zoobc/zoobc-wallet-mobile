import { Component, OnInit } from '@angular/core';
import { makeShortAddress } from 'src/Helpers/converters';
import { sanitizeString } from 'src/Helpers/utils';
import { Contact } from 'src/app/Interfaces/contact';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AccountService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html'
})
export class AddAddressPage implements OnInit {
  constructor(
    private addressBookSrv: AddressBookService,
    private navCtrl: NavController,
    private afs: AngularFirestore,
    private accountSrv: AccountService
  ) {}

  async onSubmit(value: any) {
    const { name, address } = value;

    const contact: Contact = {
      name: name,
      address: sanitizeString(address),
      shortAddress: makeShortAddress(sanitizeString(address))
    };

    //await this.addressBookSrv.insert(contact);

    const addressPath0 = await this.accountSrv.getPath0Address();
    const account = this.afs.collection('account/' + addressPath0 + '/contact');
    await account.add(contact);
    this.goBack();
  }

  ngOnInit() {}

  goBack() {
    this.navCtrl.navigateBack('/address-book');
  }
}
