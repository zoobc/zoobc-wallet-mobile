import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { BalanceService } from '../../service/balance.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  data1: any;
  data2: any;
  data3: any;
  data4: any;
  balance: any;

  constructor(public api: BalanceService, public loadingController: LoadingController) { }

  async getData() {
    const loading = await this.loadingController.create({
      message: 'Loading'
    });
    await loading.present();
    this.api.getData()
      .subscribe(res => {
        console.log(res);
        this.data1 = res[0];
        this.data2 = res[1];
        this.data3 = res[2];
        this.data4 = res[3];
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  getBalance(){
      this.balance = 23450909;
  }

  ngOnInit() {
    this.getBalance();
    this.getData();
  }

}
