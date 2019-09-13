import { Component, OnInit } from "@angular/core";
import { NavController, AlertController } from "@ionic/angular";
import { AddressBookService } from "src/app/Services/address-book.service";
import { AddressBook } from "src/app/Interfaces/address-book";

@Component({
  selector: "app-address-book",
  templateUrl: "./address-book.page.html",
  styleUrls: ["./address-book.page.scss"]
})
export class AddressBookPage implements OnInit {
  addresses: AddressBook[];

  constructor(
    private navCtrl: NavController,
    private addressBookSrv: AddressBookService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.addressBookSrv.onInsert().subscribe(addressObj => {
      this.addresses.push(addressObj);
    });

    this.loadData();
  }

  async loadData() {
    const addresses = await this.addressBookSrv.getAll();

    this.addresses = [];

    if (addresses) {
      for (let i = 0; i < addresses.length; i++) {
        const { name, address, created } = addresses[i];
        this.addresses.push(<AddressBook>{
          name,
          address,
          created
        });
      }
    }
  }

  createNewAddress() {
    this.navCtrl.navigateForward("/address-book/add");
  }

  delete(index) {
    this.presentDeleteConfirm(index);
  }

  async presentDeleteConfirm(index) {
    const alert = await this.alertCtrl.create({
      header: "Confirmation",
      message: "Are you sure want to delete?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {}
        },
        {
          text: "Delete",
          handler: async () => {
            await this.addressBookSrv.delete(index);
            this.loadData();
          }
        }
      ]
    });

    await alert.present();
  }
}
