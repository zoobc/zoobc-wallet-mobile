import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AddressBook } from "src/app/Interfaces/address-book";
import { AddressBookService } from "src/app/services/address-book.service";
import { ModalController, ToastController } from "@ionic/angular";
import { AddressBookFormComponent } from "../address-book-form/address-book-form.component";

@Component({
  selector: "app-address-book-list",
  templateUrl: "./address-book-list.component.html",
  styleUrls: ["./address-book-list.component.scss"]
})
export class AddressBookListComponent implements OnInit {
  @Output() itemClicked = new EventEmitter<string>();

  addresses: AddressBook[] = [];

  constructor(
    private addressBookSrv: AddressBookService,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    const addresses = await this.addressBookSrv.getAll();

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

  copyAddress(index){

    const val =   this.addresses[index];
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val.address;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.copySuccess();
  }

  async copySuccess() {
    const toast = await this.toastController.create({
      message: 'Your address copied to clipboard.',
      duration: 2000
    });

    toast.present();
  }

  selectAddress(index) {
    const address = this.addresses[index];
    this.itemClicked.emit(address.address);
  }

  createNewAddress() {
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddressBookFormComponent
    });

    modal.onDidDismiss().then((returnVal: any) => {
      if (returnVal.data.addressObj) {
        const addressObj = returnVal.data.addressObj;

        this.addresses.push(addressObj);
      }
    });

    return await modal.present();
  }
}
