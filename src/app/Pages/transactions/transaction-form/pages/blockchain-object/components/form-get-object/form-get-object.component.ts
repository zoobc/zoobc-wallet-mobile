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

import {
  Component,
  forwardRef,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { IBlockchainObjectItem } from 'src/app/Interfaces/bc-object-item';
import { PopoverBlockchainObjectComponent } from './popover-blockchain-object/popover-blockchain-object.component';

@Component({
  selector: 'app-form-get-object',
  templateUrl: './form-get-object.component.html',
  styleUrls: ['./form-get-object.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormGetObjectComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class FormGetObjectComponent implements OnInit, ControlValueAccessor {
  public blockchainObjectItem: IBlockchainObjectItem = {
    title: 'ZBO_F6CRZPOG_C42A7M37_WRL2EVBV_KA5PKBGI_SBGVZHMH_VIFZ7CMQ_VMOFWD3P',
    desc: '2 minutes ago'
  };

  constructor(
    private popoverCtrl: PopoverController,
  ) {}

  async ngOnInit() {}

  async switchBlockchainObject(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopoverBlockchainObjectComponent,
      event: ev,
      cssClass: 'popover-blockchain-object',
      translucent: true
    });

    popover.onWillDismiss().then(async ({ data }: { data: IBlockchainObjectItem }) => {
      if (data) {
        this.blockchainObjectItem = data;
        this.onChange(data);
      }
    });

    return popover.present();
  }

  onChange = (value: IBlockchainObjectItem) => {};

  onTouched = () => {};

  writeValue(value: IBlockchainObjectItem) {
    this.blockchainObjectItem = value;
  }

  registerOnChange(fn: (value: IBlockchainObjectItem) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
}
