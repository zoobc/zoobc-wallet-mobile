import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { Location } from '@angular/common';
import {
  NavController,
  AlertController,
  PopoverController
} from '@ionic/angular';
import {
  FOR_RECIPIENT,
  FOR_APPROVER,
  FOR_PARTICIPANT,
  FOR_SIGNBY
} from 'src/environments/variable.const';
import { UtilService } from 'src/app/Services/util.service';
import { PopoverOptionComponent } from 'src/app/Shared/component/popover-option/popover-option.component';

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
    private addressBookSrv: AddressBookService,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    public popoverController: PopoverController,
    private utilService: UtilService
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.getAllAddress();
      }
    });
  }

  async showOption(ev: any, addressIndex: number) {
    const popover = await this.popoverController.create({
      component: PopoverOptionComponent,
      componentProps: {
        options: [
          {
            key: 'copy',
            label: 'copy address'
          },
          {
            key: 'edit',
            label: 'edit address'
          },
          {
            key: 'delete',
            label: 'delete address'
          }
        ]
      },
      event: ev,
      translucent: true
    });

    const address = this.addresses[addressIndex];

    popover.onWillDismiss().then(({ data }) => {
      switch (data) {
        case 'copy':
          this.utilService.copyToClipboard(address.address);
          break;
        case 'edit':
          this.editAddress(addressIndex);
          break;
        case 'delete':
          this.deleteAddress(addressIndex);
          break;
      }
    });

    return popover.present();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(() => {
      if (
        this.router.getCurrentNavigation() &&
        this.router.getCurrentNavigation().extras.state
      ) {
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

  selectAddress(address: any) {
    if (!this.forWhat) {
      return;
    }
    if (this.forWhat === FOR_RECIPIENT) {
      this.addressBookSrv.setRecipientAddress(address);
    } else if (this.forWhat === FOR_APPROVER) {
      this.addressBookSrv.setApproverAddress(address);
    } else if (this.forWhat === FOR_PARTICIPANT) {
      this.addressBookSrv.setParticipant(address);
    } else if (this.forWhat === FOR_SIGNBY) {
      this.addressBookSrv.setSignBy(address);
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
