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
import zoobc, { AccountDatasetListParams, AccountDatasetsResponse, BIP32Interface, RemoveDatasetInterface } from 'zoobc-sdk';
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
    private modalCtrl: ModalController,
    private authServ: AccountService,
    private translate: TranslateService
  ) {
    this.formDataset = new FormGroup({
      fee: this.feeForm,
      feeCurr: this.feeFormCurr,
      typeFee: this.typeFeeField,
    });
  }

  ngOnInit() {
    console.log('== account: ', this.account);
    // if currency changed
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
    const listParam: AccountDatasetListParams = {
      recipientAccountAddress: this.account.address,
    };
    zoobc.AccountDataset.getList(listParam)
      .then((res: AccountDatasetsResponse) => {
        this.dataSetList = res.accountdatasetsList;
        console.log('== this dataset: ', this.dataSetList);
      })
      .catch(err => {
        this.isError = true;
        console.log(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }


  onRefresh() {
    this.getDataSetList();
  }

}
