import { Component, OnInit } from '@angular/core';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { sanitizeString } from 'src/Helpers/utils';
import { Contact } from 'src/app/Interfaces/contact';
import { UtilService } from 'src/app/Services/util.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-export-import',
  templateUrl: './export-import.page.html',
  styleUrls: ['./export-import.page.scss']
})
export class ExportImportPage implements OnInit {
  constructor(
    private addressBookSrv: AddressBookService,
    private utilService: UtilService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  addresses = '';
  async ngOnInit() {
    const alladdress = await this.addressBookSrv.getAll();
    if (alladdress) {
      this.addresses = JSON.stringify(
        alladdress.map((addrs: any) => {
          return {
            name: addrs.name,
            address: addrs.address
          };
        })
      );
    }
  }

  copy() {
    this.utilService.copyToClipboard(this.addresses);
  }

  async save() {
    try {
      const arrAddresses: any[] = JSON.parse(this.addresses);
      const addresses: Contact[] = [];
      for (let i = 0; i < arrAddresses.length; i++) {
        const { name, address } = arrAddresses[i];
        if (name && address) {
          const contact: Contact = {
            name,
            address: sanitizeString(address)
          };
          addresses.push(contact);
        }
      }

      await this.addressBookSrv.update(addresses);
      this.navCtrl.pop();
    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'You have entered wrong json format',
        buttons: ['OK']
      });

      await alert.present();
    }
  }
}
