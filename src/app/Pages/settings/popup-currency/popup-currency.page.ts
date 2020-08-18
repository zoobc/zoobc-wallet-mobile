import { Component, OnInit } from '@angular/core';
import { CURRENCY_LIST } from 'src/environments/variable.const';
import { ModalController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-popup-currency',
  templateUrl: './popup-currency.page.html',
  styleUrls: ['./popup-currency.page.scss'],
})
export class PopupCurrencyPage implements OnInit {
  public currencyList = [];
  public Object = Object;
  constructor(private modalController: ModalController,
              private loadingController: LoadingController) { }

  async ngOnInit() {
     // show loading bar
     const loading = await this.loadingController.create({
      message: 'loading ...',
      duration: 50000
    });

     await loading.present();

     this.convertList();

     loading.dismiss();
  }

  convertList() {
    this.currencyList = [];
    const keys =  this.Object.keys(CURRENCY_LIST);
    keys.forEach( (element) => {
      this.currencyList.push({code: element, name: CURRENCY_LIST[element]});
    });
  }

  async currencyClicked(curr: any) {
    await this.modalController.dismiss(curr);
  }

  async close() {
    await this.modalController.dismiss();
  }
}
