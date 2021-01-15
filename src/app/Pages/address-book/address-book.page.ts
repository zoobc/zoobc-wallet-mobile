// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AddressBookService } from 'src/app/Services/address-book.service';
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
import { PopoverOptionComponent } from 'src/app/Components/popover-option/popover-option.component';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.page.html',
  styleUrls: ['./address-book.page.scss']
})
export class AddressBookPage implements OnInit, OnDestroy {
  addresses = [];
  navigationSubscription: any;
  forWhat: string;
  private textCopyAddress: string;
  private textEditAddress: string;
  private textDeleteAddress: string;


  constructor(
    private router: Router,
    private navCtrl: NavController,
    private addressBookSrv: AddressBookService,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    public popoverController: PopoverController,
    private utilService: UtilService,
    private translateSrv: TranslateService
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
            label: this.textCopyAddress
          },
          {
            key: 'edit',
            label: this.textEditAddress
          },
          {
            key: 'delete',
            label: this.textDeleteAddress
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

    this.translateSrv.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateLang();
    });

    this.translateLang();

  }

  translateLang() {
    this.translateSrv.get([
      'copy',
      'edit',
      'delete',
    ]).subscribe((res: any) => {
      this.textCopyAddress = res.copy;
      this.textEditAddress = res.edit;
      this.textDeleteAddress = res.delete;
    });
  }

  async getAllAddress() {
    const alladdress = await this.addressBookSrv.getAll();
    if (alladdress) {
      this.addresses = alladdress;
    }
  }

  selectAddress(address: any) {
    this.addressBookSrv.setSelectedAddress({
      identity: this.forWhat,
      address
    });


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
