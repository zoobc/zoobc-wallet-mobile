import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AddressBookService } from 'src/app/services/address-book.service';
import { ModalController, ToastController } from '@ionic/angular';
import { AddressBookFormComponent } from '../address-book-form/address-book-form.component';

@Component({
  selector: 'app-address-book-list',
  templateUrl: './address-book-list.component.html',
  styleUrls: ['./address-book-list.component.scss']
})
export class AddressBookListComponent implements OnInit {
  @Output() itemClicked = new EventEmitter<string>();

  addresses = [];

  constructor(
    private addressBookSrv: AddressBookService,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.getAllAddress();
  }

  async getAllAddress() {
    const alladdress = await this.addressBookSrv.getAll();
    if (alladdress) {
      this.addresses = alladdress;
    }
  }

  copyAddress(index: string | number) {

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

  selectAddress(index: number) {
    const address = this.addresses[index];
    this.itemClicked.emit(address.address);
  }

  editAddress(index: number) {
    const address = this.addresses[index];
    this.presentModal(address, index, 'edit');
  }

  deleteAddress(index: number) {
    this.addresses.splice(index, 1);
    this.addressBookSrv.update(this.addresses);
  }

  createNewAddress() {
    this.presentModal({name: '', address: ''}, 0, 'new');
  }

  async presentModal(arg: any, idx: number, trxMode: string) {
    const modal = await this.modalController.create({
      component: AddressBookFormComponent,
      componentProps: {
        name: arg.name,
        address: arg.address,
        mode: trxMode,
        index: idx
      }
    });

    modal.onDidDismiss().then((returnVal: any) => {
      this.getAllAddress();
    });

    return await modal.present();
  }
}
