import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/Interfaces/contact';
import { sanitizeString } from 'src/Helpers/utils';
import { NavController } from '@ionic/angular';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html'
})
export class EditAddressPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private addressBookSrv: AddressBookService,
    private activeRoute: ActivatedRoute
  ) {}

  addressId: number;
  value: { name: string; address: string };

  ngOnInit() {
    this.activeRoute.params.subscribe(async params => {
      this.addressId = Number(params.addressId);

      const data = await this.addressBookSrv.getOneByIndex(this.addressId);
      const { name, address } = data;

      this.value = { name, address };
    });
  }

  async onSubmit(value: any) {
    const { name, address } = value;
    const contact: Contact = {
      name,
      address: sanitizeString(address)
    };

    await this.addressBookSrv.updateByIndex(contact, this.addressId);

    this.goBack();
  }

  goBack() {
    this.navCtrl.navigateBack('/address-book');
  }
}
