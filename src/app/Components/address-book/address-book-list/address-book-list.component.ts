import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { ToastController} from '@ionic/angular';
import { NavigationExtras, Router, NavigationEnd } from '@angular/router';
import { EDIT_MODE, NEW_MODE } from 'src/environments/variable.const';

@Component({
  selector: 'app-address-book-list',
  templateUrl: './address-book-list.component.html',
  styleUrls: ['./address-book-list.component.scss']
})
export class AddressBookListComponent implements OnInit, OnDestroy {
  @Output() itemClicked = new EventEmitter<string>();

  addresses = [];
  navigationSubscription: any;

  constructor(
    private router: Router,
    private addressBookSrv: AddressBookService,
    private toastController: ToastController
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        // console.log('=== NavigationEnd');
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
    // console.log('=== ngOninit');
    this.getAllAddress();
  }

  ionViewWillEnter(){
    // console.log('=== ionViewWillEnter');
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
      message: 'Copied to clipboard.',
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
    this.openAddressdForm(address, index, EDIT_MODE);
  }

  deleteAddress(index: number) {
    this.addresses.splice(index, 1);
    this.addressBookSrv.update(this.addresses);
  }

  createNewAddress() {
    this.openAddressdForm({name: '', address: ''}, 0, NEW_MODE);
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
}
