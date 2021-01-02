import { Component, OnInit } from '@angular/core';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { Contact } from 'src/app/Interfaces/contact';
import { UtilService } from 'src/app/Services/util.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-export-import',
  templateUrl: './export-import.page.html',
  styleUrls: ['./export-import.page.scss']
})
export class ExportImportPage implements OnInit {

  addresses = '';

  constructor(
    private addressBookSrv: AddressBookService,
    private utilService: UtilService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    // const alladdress = await this.addressBookSrv.getAll();
    // if (alladdress) {
    //   this.addresses = JSON.stringify(
    //     alladdress.map((addrs: any) => {
    //       return {
    //         name: addrs.name,
    //         address: addrs.address
    //       };
    //     })
    //   );
    // }
  }

  copy() {
    this.utilService.copyToClipboard(this.addresses);
  }

  public uploadFile(files: FileList) {
    if (files && files.length > 0) {
      const file = files.item(0);
      const fileReader: FileReader = new FileReader();
      fileReader.readAsText(file, 'JSON');
      fileReader.onload = async () => {
        try {
          const arrAddresses: any[] = JSON.parse(fileReader.result.toString());
          const addresses: Contact[] = [];
          for (let i = 0; i < arrAddresses.length; i++) {
            const { name, address } = arrAddresses[i];
            if (name && address) {
              const contact: Contact = {
                name,
                address: (address)
              };
              addresses.push(contact);
            }
          }
          await this.addressBookSrv.update(addresses);

        } catch (error) {
          const alert = await this.alertCtrl.create({
            header: 'Error',
            message: 'You have entered wrong json format',
            buttons: ['OK']
          });
          await alert.present();
        }
      };
    }
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
            address: (address)
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
