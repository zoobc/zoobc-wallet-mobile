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
//             contact us at roberto.capodieci[at]blockchainzoo.com
//             and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.


import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/Interfaces/account';
import { Currency } from 'src/app/Interfaces/currency';
import { AccountService } from 'src/app/Services/account.service';
import { CurrencyService } from 'src/app/Services/currency.service';
import { COIN_CODE, TRANSACTION_MINIMUM_FEE } from 'src/environments/variable.const';
import { truncate } from 'src/Helpers/utils';
import { NewDatasetPage } from './new-dataset/new-dataset.page';

@Component({
  selector: 'app-dataset-account',
  templateUrl: './dataset-account.page.html',
  styleUrls: ['./dataset-account.page.scss'],
})
export class DatasetAccountPage implements OnInit {
  account: Account;

  subscription: Subscription = new Subscription();
  dataSetList: any[];
  dataSet: any;
  isLoading: boolean;
  isError: boolean;
  isLoadingDelete: boolean;
  isErrorDelete: boolean;
  minFee = TRANSACTION_MINIMUM_FEE;
  currencyRate: Currency;
  formDataset: FormGroup;
  feeForm = new FormControl(this.minFee, [Validators.required, Validators.min(this.minFee)]);
  feeFormCurr = new FormControl('', Validators.required);
  typeFeeField = new FormControl(COIN_CODE);

  constructor(
    private activeRoute: ActivatedRoute,
    private currencyServ: CurrencyService,
    private modalCtrl: ModalController  ) {
    this.formDataset = new FormGroup({
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      typeFee: this.typeFeeField,
    });
  }

  ngOnInit() {
    console.log('== account: ', this.account);
    const subsRate = this.currencyServ.currencySubject.subscribe((rate: Currency) => {
      this.currencyRate = rate;
      const minCurrency = truncate(this.minFee * rate.value, 8);
      this.feeFormCurr.patchValue(minCurrency);
      this.feeFormCurr.setValidators([Validators.required, Validators.min(minCurrency)]);
    });
    this.subscription.add(subsRate);

    this.activeRoute.queryParams.subscribe(params => {
      this.account = JSON.parse(params.account);
      this.getDataSetList();
    });

  }

  async createNewDataset() {
    const modal = await this.modalCtrl.create({
      component: NewDatasetPage,
      componentProps: {
        account: this.account
      }
    });
    return await modal.present();
  }

  getDataSetList() {
    this.isError = false;
    this.isLoading = true;
  }


  onRefresh() {
    this.getDataSetList();
  }

}
