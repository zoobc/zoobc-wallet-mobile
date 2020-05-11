import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, NavigationExtras } from '@angular/router';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { Location } from '@angular/common';
import { EDIT_MODE, NEW_MODE } from 'src/environments/variable.const';
import { AccountService } from 'src/app/Services/account.service';
import { UtilService } from 'src/app/Services/util.service';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.page.html',
  styleUrls: ['./address-book.page.scss'],
})
export class AddressBookPage implements OnInit, OnDestroy {

  addresses = [];
  navigationSubscription: any;

  constructor(
    private location: Location,
    private router: Router,
    private utilService: UtilService,
    private addressBookSrv: AddressBookService
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

  async getAllAddress() {
    const alladdress = await this.addressBookSrv.getAll();
    if (alladdress) {
      this.addresses = alladdress;
    }
  }

  copyAddress(index: string | number) {
    const val =   this.addresses[index];
    this.utilService.copyToClipboard(val.address);
  }

  selectAddress(address: any) {
    this.addressBookSrv.setSelectedAddress(address.address);
    this.location.back();
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
