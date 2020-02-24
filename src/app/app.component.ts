import { Component, OnInit } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LanguageService } from 'src/app/Services/language.service';
import { AboutPage } from './Pages/about/about.page';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { CurrencyService, Currency } from 'src/app/Services/currency.service';
import { OPENEXCHANGE_RATES_STORAGE, TRX_FEES_STORAGE, SELECTED_NODE, ACTIVE_CURRENCY, NETWORK_LIST } from 'src/environments/variable.const';
import { TransactionFeesService } from './Services/transaction-fees.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { listChanges } from '@angular/fire/database';
import { NetworkService } from './Services/network.service';

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
    private networkService: NetworkService,
    private toastController: ToastController,
    private network: Network,
    private firestore: AngularFirestore,
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
      this.networkService.setInitialNetwork();
      this.getExchangeRateList();
      // this.getCurrencyRateList();
      this.createTransactionFees();
      this.setNodes();
      this.setDefaultCurrency();
      this.splashScreen.hide();
    });
  }

  async setDefaultCurrency() {
    const curr = await this.storage.get(ACTIVE_CURRENCY);
    console.log('=== Active Currency: ', curr);
    if (curr) {
      return;
    }
    await this.storage.set(ACTIVE_CURRENCY, 'USD');
  }

  createTransactionFees() {
    this.trxFeeService.readTrxFees().subscribe(async (data: any) => {
      const allFees = data.map(e => {
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

  async setNodes() {
    const node = await this.storage.get(SELECTED_NODE);
    if (!node) {
      await this.storage.set(SELECTED_NODE, NETWORK_LIST[0].domain);
    }
  }

  // async setCurrencyRateList() {
  //   await this.storage.get(OPENEXCHANGE_RATES_STORAGE).then((strg) => {
  //     const rates = Object.keys(strg.rates).map(currencyName => {
  //       const rate: Currency = {
  //         name: currencyName,
  //         value: strg.rates[currencyName],
  //       };
  //       return rate;
  //     });
  //     this.currencyService.setCurrencyRateList(rates);
  //   }).catch(error => {
  //     console.log(' Error on app components: ', error);
  //   });
  // }

  // getCurrencyRateList() {
  //   this.currencyService.getCurrencyRateFromThirdParty().subscribe(async (res: any) => {
  //     console.log('==xxxx  currencyRate timestamp 2: ', res.timestamp);
  //     if (res) {
  //       this.currencyService.setCurrencyRateList(res);
  //       await this.storage.set(OPENEXCHANGE_RATES_STORAGE, res);
  //     } else {
  //       this.currencyService.setCurrencyRateList(await this.storage.get(OPENEXCHANGE_RATES_STORAGE));
  //     }
  //   });
  // }

  async presentNoConnectionToast() {
    const toast = await this.toastController.create({
      message: this.connectionText,
      duration: 3000
    });
    toast.present();
  }


  getExchangeRateList() {
   this.readExchangeRates().subscribe( async data => {    
      let i  = 0;
      data.map(async e => {
          const res = JSON.parse(e.payload.doc.data()['rate0']);
          if (res && res.rates) {
            this.currencyService.setCurrencyRateList(res);
            await this.storage.set(OPENEXCHANGE_RATES_STORAGE, res);
          } else {
            this.currencyService.setCurrencyRateList(await this.storage.get(OPENEXCHANGE_RATES_STORAGE));
          }
      });      
    });
  }

  readExchangeRates() {
    return this.firestore.collection('openexchange').snapshotChanges();
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
