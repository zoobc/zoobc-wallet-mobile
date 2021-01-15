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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController
} from '@ionic/angular';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { TransactionService } from 'src/app/Services/transaction.service';
import { TRANSACTION_MINIMUM_FEE } from 'src/environments/variable.const';
import { objectItemValidator } from 'src/Helpers/validators';

@Component({
  selector: 'app-blockchain-object-create',
  templateUrl: './blockchain-object-create.page.html',
  styleUrls: ['./blockchain-object-create.page.scss']
})
export class BlockchainObjectCreatePage implements OnInit, OnDestroy {
  allFees = this.transactionSrv.transactionFees(TRANSACTION_MINIMUM_FEE);

  private minimumFee = TRANSACTION_MINIMUM_FEE;

  private textKeyRequired: string;
  private textKeyMin: string;
  private textKeyMax: string;
  private textValueRequired: string;
  private textValueMin: string;
  private textValueMax: string;

  createForm = new FormGroup({
    objectItems: new FormArray([
      new FormGroup({
        objectItem: new FormControl({key: '', value: ''}, [objectItemValidator]),
      })
    ]),
    fee: new FormControl(this.allFees[0].fee, [
      Validators.required,
      Validators.min(this.minimumFee)
    ])
  });

  submitted = false;

  minimumObjectItems = 1;

  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    public addressbookService: AddressBookService,
    private transactionSrv: TransactionService,
    private translateSrv: TranslateService,
    private router: Router,
  ) {}

  get objectItems() {
    return this.createForm.get('objectItems') as FormArray;
  }

  get fee() {
    return this.createForm.get('fee');
  }

  objectItemsError: any = [];

  createFormSubscription: any;
  async ngOnInit() {
    this.createFormSubscription = this.createForm.get('objectItems').valueChanges.subscribe(values => {
  
      this.objectItemsError = [];
      for ( let i = 0; i < values.length; i++) {

        if((this.objectItems.controls[i].get('objectItem').dirty 
          || this.objectItems.controls[i].get('objectItem').touched
          ) && this.objectItems.controls[i].get('objectItem').invalid){
          
            this.setObjectItemsError(i);
        }
      }
    });

    this.translateSrv.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateLang();
    });

    this.translateLang();
  }

  setObjectItemsError(i: number){
    const errors = this.objectItems.controls[i].get('objectItem').errors;

    let errorKey = '';
    let errorValue = '';

    if(errors && errors.hasOwnProperty('keyRequired')) {
      errorKey = this.textKeyRequired;
    }else if(errors && errors.hasOwnProperty('keyMax')) {
      errorKey = this.textKeyMax;
    }else if(errors && errors.hasOwnProperty('keyMin')) {
      errorKey = this.textKeyMin;
    }

    if(errors && errors.hasOwnProperty('valueRequired')) {
      errorValue = this.textValueRequired;
    }else if(errors && errors.hasOwnProperty('valueMax')) {
      errorValue = this.textValueMax;
    }else if(errors && errors.hasOwnProperty('valueMin')) {
      errorValue = this.textValueMin;
    }

    this.objectItemsError[i] = {
      key: errorKey,
      value: errorValue
    };
  }

  translateLang(){

    this.translateSrv.get([
      'Key is required',
      'value is required',
    ]).subscribe((res: any)=>{
      this.textKeyRequired = res["Key is required"];
      this.textValueRequired = res["value is required"];
    })

    this.translateSrv.get('the minimum characters is', {value: '3'}).subscribe((res: any)=>{
      this.textKeyMin = res;
      this.textValueMin = res;
    })

    this.translateSrv.get('the minimum characters is', {value: '255'}).subscribe((res: any)=>{
      this.textKeyMax = res;
      this.textValueMax = res;
    })
  }

  ngOnDestroy() {
    if (this.createFormSubscription) {
       this.createFormSubscription.unsubscribe();
    }
  }

  addObjectItem() {
    this.objectItems.push( new FormGroup({
      objectItem: new FormControl({key: '', value: ''}, [objectItemValidator]),
    }));
  }

  removeObjectItem(index: number) {
    this.objectItems.controls.splice(index, 1);
  }

  onSubmit() {
    this.submitted = true;

    for ( let i = 0; i < this.objectItems.value.length; i++) {
      this.setObjectItemsError(i);
    }

    if (this.createForm.valid) {
      this.router.navigate(['/transaction-form/blockchain-object/create/success']);
    }
  }
}
