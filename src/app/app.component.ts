import { Component, OnInit } from '@angular/core';

import { Platform, ToastController, AlertController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LanguageService } from 'src/app/Services/language.service';
import { AboutPage } from './Pages/about/about.page';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { CurrencyService } from 'src/app/Services/currency.service';
import { OPENEXCHANGE_RATES_STORAGE, TRX_FEES_STORAGE, OPENEXCHANGE_CURR_LIST_STORAGE } from 'src/environments/variable.const';
import { TransactionFeesService } from './Services/transaction-fees.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  public rootPage: any = AboutPage;

  private connectionText = '';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private languageService: LanguageService,
    private toastController: ToastController,
    private network: Network,
    private storage: Storage,
    private trxFeeService: TransactionFeesService,
    private translateService: TranslateService,
    private currencyService: CurrencyService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.languageService.setInitialAppLanguage();
      this.getCurrencyList();
      this.getCurrencyRates();
      this.createTransactionFees();
      this.splashScreen.hide();
    });
  }


  createTransactionFees() {
    this.trxFeeService.readTrxFees().subscribe( async (data: any) => {
      const allFees =  data.map(e => {
        return {
          // id: e.payload.doc.id,
          name: e.payload.doc.data()['name'],
          fee: e.payload.doc.data()['fee']
        };
      });

      if (allFees) {
        await this.storage.set(TRX_FEES_STORAGE, allFees);
      }
    });

  }

  getCurrencyRates() {
    this.currencyService.getCurrencyRateFromThirdParty().subscribe(async (res: any) => {
      if (res && res.rates) {
        await this.storage.set(OPENEXCHANGE_RATES_STORAGE, res.rates);
      }
    });

  }

  getCurrencyList() {
    this.currencyService.getCurrencyListFromThirdParty().subscribe(async (res: any) => {
      console.log('==  currencylist: ', res);
      if (res) {
        await this.storage.set(OPENEXCHANGE_CURR_LIST_STORAGE, res);
      }
    });

  }

  async presentNoConnectionToast() {
    const toast = await this.toastController.create({
      message: this.connectionText,
      duration: 3000
    });
    toast.present();
  }

  ngOnInit() {
    this.network.onDisconnect().subscribe(() => {
      this.presentNoConnectionToast();
    });

    this.translateService
      .get('Please check internet connection')
      .subscribe((res: string) => {
        this.connectionText = res;
      });
  }


}
