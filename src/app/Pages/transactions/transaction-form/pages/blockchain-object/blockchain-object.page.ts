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
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  PopoverController
} from '@ionic/angular';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { PopoverOptionComponent } from 'src/app/Components/popover-option/popover-option.component';

@Component({
  selector: 'app-blockchain-object',
  templateUrl: './blockchain-object.page.html',
  styleUrls: ['./blockchain-object.page.scss']
})
export class BlockchainObjectPage implements OnInit {

  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    public addressbookService: AddressBookService,
    private router: Router,
    public popoverController: PopoverController,
    private translateSrv: TranslateService
  ) { }

  blockchainObjects = [
    {
      id: 'ZBO_F6CR...WD3R',
      info: '5 days ago'
    },
    {
      id: 'ZBO_F6CR...WFJ7',
      info: '4 days ago'
    },
    {
      id: 'ZBO_F6CR...OP6Y',
      info: '3 days ago'
    },
    {
      id: 'ZBO_F6CR...JK7Y',
      info: '2 days ago'
    }
  ];

  private textViewDetail: string;
  private textEdit: string;

  async ngOnInit() {
    this.translateSrv.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateLang();
    });

    this.translateLang();
  }

  translateLang() {
    this.translateSrv.get([
      'View Detail',
      'edit',
    ]).subscribe((res: any) => {
      this.textViewDetail = res['View Detail'];
      this.textEdit = res.edit;
    });
  }

  createBlockchainObject() {
    this.router.navigate(['/transaction-form/blockchain-object/create']);
  }

  async showOption(ev: any, addressIndex: number) {
    const popover = await this.popoverController.create({
      component: PopoverOptionComponent,
      componentProps: {
        options: [
          {
            key: 'viewDetail',
            label: this.textViewDetail
          },
          {
            key: 'edit',
            label: this.textEdit
          }
        ]
      },
      event: ev,
      translucent: true
    });

    popover.onWillDismiss().then(({ data }) => {
      switch (data) {
        case 'viewDetail':
          this.router.navigate(['/transaction-form/blockchain-object/detail']);
          break;
        case 'edit':
          console.log('edit');
          break;
      }
    });

    return popover.present();
  }
}
