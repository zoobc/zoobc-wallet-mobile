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
