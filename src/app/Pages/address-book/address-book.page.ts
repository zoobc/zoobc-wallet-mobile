import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { Location } from '@angular/common';
import { UtilService } from 'src/app/Services/util.service';
import { NavController, AlertController } from '@ionic/angular';
import { FOR_RECIPIENT, FOR_APPROVER } from 'src/environments/variable.const';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.page.html',
  styleUrls: ['./address-book.page.scss']
})
export class AddressBookPage implements OnInit, OnDestroy {
  addresses = [];
  navigationSubscription: any;
  forWhat: string;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private utilService: UtilService,
    private addressBookSrv: AddressBookService,
    private alertCtrl: AlertController,
    private route: ActivatedRoute
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
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
    this.route.queryParams.subscribe( () => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        this.forWhat = this.router.getCurrentNavigation().extras.state.forWhat;
      } else {
        this.forWhat = null;
      }
    });
    this.getAllAddress();
  }

  async getAllAddress() {
    const alladdress = await this.addressBookSrv.getAll();
    if (alladdress) {
      this.addresses = alladdress;
    }
  }

  copyAddress(index: string | number) {
    const val = this.addresses[index];
    this.utilService.copyToClipboard(val.address);
  }

  selectAddress(address: any) {
    if (!this.forWhat) {
      return;
    }
    if (this.forWhat === FOR_RECIPIENT) {
      this.addressBookSrv.setRecipientAddress(address);
    } else if (this.forWhat === FOR_APPROVER) {
      this.addressBookSrv.setApproverAddress(address);
    }
    this.navCtrl.pop();
  }

  editAddress(index: number) {
    this.navCtrl.navigateForward('/address-book/' + index);
  }

  async deleteAddress(index: number) {
    const alert = await this.alertCtrl.create({
      message: 'Are you sure want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Yes',
          handler: () => {
            this.addresses.splice(index, 1);
            this.addressBookSrv.update(this.addresses);
          }
        }
      ]
    });

    await alert.present();
  }

  createNewAddress() {
    this.router.navigate(['/address-book/add']);
  }
}
