import { Component, OnInit } from '@angular/core';
import { CURRENCY_LIST, SELECTED_LANGUAGE, STORAGE_ACTIVE_CURRENCY } from 'src/environments/variable.const';
import { LoadingController, NavController } from '@ionic/angular';
import { CurrencyService, ICurrency } from 'src/app/Services/currency.service';
import { StorageService } from 'src/app/Services/storage.service';


@Component({
  selector: 'app-popup-currency',
  templateUrl: './popup-currency.page.html',
  styleUrls: ['./popup-currency.page.scss'],
})
export class PopupCurrencyPage implements OnInit {
  public currencyList = [];
  public Object = Object;
  public activeCurrency = null;

  constructor(
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private currencySrv: CurrencyService,
    private strgSrv: StorageService
  ) { }

  async ngOnInit() {
     // show loading bar
    const loading = await this.loadingController.create({
      message: 'loading ...',
      duration: 50000
    });

    await loading.present();

    this.convertList();

    loading.dismiss();

    const activeCurrencyCode = await this.strgSrv.get(STORAGE_ACTIVE_CURRENCY);
    this.activeCurrency = this.currencySrv.getOne(activeCurrencyCode)
  }

  convertList() {
    this.currencyList = [];
    const keys =  this.Object.keys(CURRENCY_LIST);
    keys.forEach( (element) => {
      this.currencyList.push({code: element, name: CURRENCY_LIST[element]});
    });
  }

  currencyClicked(currency: ICurrency) {
    this.currencySrv.setActiveCurrency(currency.code)
    this.currencySrv.broadcastSelectCurrency(currency);
    this.navCtrl.pop();
  }
}


