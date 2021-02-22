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
import { GroupData } from 'zbc-sdk';

@Component({
  selector: 'app-network',
  templateUrl: './network.page.html',
  styleUrls: ['./network.page.scss'],
})
export class NetworkPage implements OnInit {
  form: FormGroup;
  networks: any;
  activeNetwork: any;
  fName = new FormControl('', Validators.required);
  // fHost = new FormControl('', [Validators.required, Validators.pattern('^https?://+[\\w.-]+:\\d+$')]);
  fHost = new FormControl('', [Validators.required]);
  actionMode = 'add';
  idx = 0;
  isShowForm = false;
  textEdit = 'edit';
  textDelete = 'delete';

  isAllAddressValid = true;
  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private alertController: AlertController,
    private networkSrv: NetworkService
  ) {
    this.form = new FormGroup({
      name: this.fName,
      host: this.fHost
    });
  }

  validURL(myURL: string) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port
    '(\\?[;&amp;a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i');
    return pattern.test(myURL);
 }

  async ngOnInit() {
    this.networks = await this.networkSrv.getAll();
    console.log('List group: ', this.networks);
    this.activeNetwork = await this.networkSrv.getActiveGroup();
    console.log('activeNetwork group: ', this.activeNetwork);
  }

  selectNetwork(index: any) {
    const netSelected = this.networks[index];
    console.log('== Selectedd: ', netSelected);
    this.networkSrv.setActiveGroup(netSelected);
    this.activeNetwork = netSelected;
    this.networkSrv.broadcastSelectNetwork(netSelected);
    this.navCtrl.pop();
  }

  get errorControl() {
    return this.form.controls;
  }

  addHost() {
    this.fName.setValue('');
    this.fHost.setValue('');
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
    const networkGroup = this.networks[this.idx];
    console.log('=== selected: ', networkGroup);

    this.fName.setValue(networkGroup.label);
    const hosts = networkGroup.wkps;
    console.log('=== hosts: ', hosts);

    const hosts2 = hosts.map( (x: string) => {
        return x + '\n';
    });

    console.log('=== hosts2: ', hosts2);
    this.fHost.setValue(hosts2);
  }


  async delete(idx: number) {
    this.idx = idx;
    this.networks.splice(this.idx, 1);
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
          handler: () => {
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
    this.isAllAddressValid = true;
    this.fHost.markAsTouched();
    this.fName.markAsTouched();

    if (!this.form.valid) {
      this.isAllAddressValid = false;
      return;
    }

    if (this.actionMode === 'add') {
      console.log('.. add ....');
      // const nodes = this.fHost.value.split('\n').map( (x: string) => {
      //       return this.validURL(x.trim().replace(',', ''));
      //   }
      // );

      const lines = this.fHost.value.split('\n');
      const nodes = [];

      lines.forEach((value: string) => {
        if (value.trim() !== '' && this.validURL(value.trim())) {
          nodes.push(value.trim());
        } else {
          this.isAllAddressValid = false;
        }
      });

      const groupAdd: GroupData = {
        label: this.fName.value,
        wkps: nodes
      };

      console.log('groupAdd: ', groupAdd);
      this.networks.push(groupAdd);

      console.log('this.networks: ',   this.networks);
      await this.networkSrv.saveAll(this.networks);



    } else if (this.actionMode === 'edit') {

      console.log('.. edit ....');

      const lines = this.fHost.value.split('\n');
      const nodes = [];
      lines.forEach((value: string) => {
        if (value.trim() !== '' && this.validURL(value.trim())) {
          nodes.push(value.trim());
        } else {
          this.isAllAddressValid = false;
        }
      });

      console.log('.. this.fName.value ....', this.fName.value);
      const groupEdit: GroupData = {
        label: this.fName.value,
        wkps: nodes
      };

      console.log('==n groupEdit: ', groupEdit);
      this.networks[this.idx] = groupEdit;
      await this.networkSrv.saveAll(this.networks);
      console.log('.. saved ....');
      this.networks = await this.networkSrv.getAll();
    }

    console.log('this.isAllAddressValid: ', this.isAllAddressValid);
    this.networks = await this.networkSrv.getAll();
    // this.isShowForm = false;
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
