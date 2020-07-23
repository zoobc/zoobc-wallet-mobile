import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { Location } from '@angular/common';
import { UtilService } from 'src/app/Services/util.service';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AccountService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.page.html',
  styleUrls: ['./address-book.page.scss']
})
export class AddressBookPage implements OnInit {
  addresses = [];

  constructor(
    private location: Location,
    private router: Router,
    private navCtrl: NavController,
    private utilService: UtilService,
    private addressBookSrv: AddressBookService,
    private alertCtrl: AlertController,
    private activeRoute: ActivatedRoute,
    private afs: AngularFirestore,
    private accountSrv: AccountService
  ) {}

  async ngOnInit() {
    //this.getAllAddress();

    const addressPath0 = await this.accountSrv.getPath0Address();

    const account = this.afs.collection('account/' + addressPath0 + '/contact');

    account.valueChanges({ idField: 'documentId' }).subscribe(addresses => {
      this.addresses = addresses;
    });
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
    this.addressBookSrv.setSelectedAddress(address.address);

    this.activeRoute.queryParams.subscribe(params => {
      if (params.dismissOnClick) {
        this.location.back();
      }
    });
  }

  editAddress(index: number) {
    //this.navCtrl.navigateForward('/address-book/' + index);
    this.navCtrl.navigateForward(
      '/address-book/' + this.addresses[index].documentId
    );
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
          handler: async () => {
            //this.addresses.splice(index, 1);
            //this.addressBookSrv.update(this.addresses);

            const addressPath0 = await this.accountSrv.getPath0Address();

            this.afs
              .doc(
                'account/' +
                  addressPath0 +
                  '/contact/' +
                  this.addresses[index].documentId
              )
              .delete();
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
