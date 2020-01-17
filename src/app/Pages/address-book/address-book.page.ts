import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, NavigationExtras } from '@angular/router';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { ToastController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.page.html',
  styleUrls: ['./address-book.page.scss']
})
export class AddressBookPage implements OnInit, OnDestroy {

  addresses = [];
  navigationSubscription: any;

  constructor(
    private location: Location,
    private router: Router,
    private addressBookSrv: AddressBookService,
    private toastController: ToastController
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        console.log('=== NavigationEnd');
        this.getAllAddress();
      }
    });
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
    console.log('=== ngOninit');
    this.getAllAddress();
  }

  ionViewWillEnter(){
    console.log('=== ionViewWillEnter');
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

  selectAddress(address: any) {
    this.addressBookSrv.setSelectedAddress(address.address);
    this.location.back();
  }

  editAddress(index: number) {
    const address = this.addresses[index];
    this.openAddressdForm(address, index, 'edit');
  }

  deleteAddress(index: number) {
    this.addresses.splice(index, 1);
    this.addressBookSrv.update(this.addresses);
  }

  createNewAddress() {
    this.openAddressdForm({name: '', address: ''}, 0, 'new');
  }

  async openAddressdForm(arg: any, idx: number, trxMode: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        name: arg.name,
        address: arg.address,
        mode: trxMode,
        index: idx
      }
    };
    this.router.navigate(['/add-address'], navigationExtras);
  }

  delete(index) {
    this.presentDeleteConfirm(index);
  }

  async presentDeleteConfirm(index) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Are you sure want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Delete',
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
