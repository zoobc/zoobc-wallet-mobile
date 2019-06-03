import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { BalanceService } from '../../services/balance.service';
import { TransactionService } from '../../services/transaction.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  data1: any;
  data2: any;
  balance: any;
  transactions: any;

  constructor(public blnSrv: BalanceService, public trxSrv: TransactionService, public loadingController: LoadingController) { }

  async getBalance() {
    const loading = await this.loadingController.create({
      message: 'Loading'
    });
    await loading.present();
    this.blnSrv.getData()
      .subscribe(res => {
        console.log(res);
        this.data1 = res[0];
        this.balance = this.data1['data'];
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  async getTransaction(pKey: string) {
    const loading = await this.loadingController.create({
      message: 'Loading'
    });
    await loading.present();
    this.trxSrv.getData(pKey)
      .subscribe(res => {
        console.log(res);
        this.data2 = res[0];
        this.transactions = this.data2['transactions'];
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  ngOnInit() {
    this.getBalance();
    this.getTransaction('UiuiiuKllk');
  }

}
