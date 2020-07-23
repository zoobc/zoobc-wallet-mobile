import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/Interfaces/contact';
import { sanitizeString } from 'src/Helpers/utils';
import { makeShortAddress } from 'src/Helpers/converters';
import { NavController } from '@ionic/angular';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AccountService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html'
})
export class EditAddressPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private addressBookSrv: AddressBookService,
    private activeRoute: ActivatedRoute,
    private afs: AngularFirestore,
    private accountSrv: AccountService
  ) {}

  //addressId: number;
  addressId: string;
  value: { name: String; address: String };

  ngOnInit() {
    this.activeRoute.params.subscribe(async params => {
      /*this.addressId = Number(params.addressId);

      const data = await this.addressBookSrv.getOneByIndex(this.addressId);
      const { name, address } = data;
      this.value = { name, address };*/

      this.addressId = params.addressId;

      const addressPath0 = await this.accountSrv.getPath0Address();
      const account = this.afs.doc(
        'account/' + addressPath0 + '/contact/' + this.addressId
      );

      account.valueChanges().subscribe((data: any) => {
        const { name, address } = data;
        this.value = { name, address };
      });
    });
  }

  async onSubmit(value: any) {
    const { name, address } = value;

    const contact: Contact = {
      name: name,
      address: sanitizeString(address),
      shortAddress: makeShortAddress(sanitizeString(address))
    };

    //await this.addressBookSrv.updateByIndex(contact, this.addressId);

    const addressPath0 = await this.accountSrv.getPath0Address();
    const account = this.afs.doc(
      'account/' + addressPath0 + '/contact/' + this.addressId
    );

    account.set(contact);

    this.goBack();
  }

  goBack() {
    this.navCtrl.navigateBack('/address-book');
  }
}
