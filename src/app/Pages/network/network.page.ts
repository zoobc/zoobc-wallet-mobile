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

import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { NetworkService } from 'src/app/Services/network.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ZbcNetwork } from 'src/app/Interfaces/zbc-network';
import { PopoverOptionComponent } from 'src/app/Components/popover-option/popover-option.component';

@Component({
  selector: 'app-network',
  templateUrl: './network.page.html',
  styleUrls: ['./network.page.scss'],
})
export class NetworkPage implements OnInit {
  form: FormGroup;
  networks = [];
  activeNetwork = null;
  fName = new FormControl('', Validators.required);
  fHost = new FormControl('', [Validators.required, Validators.pattern('^https?://+[\\w.-]+:\\d+$')]);
  actionMode = 'add';
  idx = 0;
  isShowForm = false;
  textEdit = 'edit';
  textDelete = 'delete';

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private alertController: AlertController,
    private networkSrv: NetworkService
  ) { }



  async ngOnInit() {
    this.networks = this.networkSrv.getall();
    this.form = new FormGroup({
      name: this.fName,
      host: this.fHost
    });
    this.activeNetwork = await this.networkSrv.getNetwork();
  }

  selectNetwork(index: any) {
    this.networkSrv.setNetwork(index);
    this.networkSrv.broadcastSelectNetwork(this.networks[index]);
    this.navCtrl.pop();
  }

  get errorControl() {
    return this.form.controls;
  }

  addHost() {
    this.actionMode = 'add';
    this.showForm();
  }

  showForm() {
    this.isShowForm = true;
  }

  edit(idx: number) {
    this.actionMode = 'edit';
    this.idx = idx;
    this.isShowForm = true;
    const network =   this.networks[this.idx];
    this.fName.setValue(network.name);
    this.fHost.setValue(network.host);
  }

  async delete(idx: number) {
    this.idx = idx;
    this.networks.splice(this.idx, 1);
    console.log('== this.networks after delte:', this.networks);
    await this.networkSrv.saveAll(this.networks);
  }

  close() {
    this.isShowForm = false;
  }

  async deleteConfirmation() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure <strong>to delete!</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.delete(this.idx);
          }
        }
      ]
    });

    await alert.present();
  }

  async save(): Promise<void> {

    this.fHost.markAsTouched();
    this.fName.markAsTouched();

    if (!this.form.valid) {
      console.log('Please provide all the required values!');
      return;
    }

    const newHost: ZbcNetwork = {
      name: this.fName.value,
      host: this.fHost.value,
      default: false,
    };

    console.log('=== newHost: ', newHost);
    if (this.actionMode === 'add') {
      console.log(' == will add', newHost);
      await this.networkSrv.add(newHost);
    } else if (this.actionMode === 'edit') {
      console.log(' == will edit', newHost);
      this.networks[this.idx] = newHost;
      await this.networkSrv.saveAll(this.networks);
    }
    this.networks = this.networkSrv.getall();
    console.log('== Sekarang: ', this.form.value);
    this.isShowForm = false;
  }

  async showOption(ev: any, index: number) {

    this.idx = index;
    const popoverOptions = [
      {
        key: 'edit',
        label: this.textEdit
      },
      {
        key: 'delete',
        label: this.textDelete
      }
    ];

    const popover = await this.popoverCtrl.create({
      component: PopoverOptionComponent,
      componentProps: {
        options: popoverOptions
      },
      event: ev,
      translucent: true
    });

    popover.onWillDismiss().then(({ data: action }) => {
      switch (action) {
        case 'edit':
          this.edit(index);
          break;
        case 'delete':
          this.deleteConfirmation();
          break;
      }
    });

    return popover.present();
  }

}
