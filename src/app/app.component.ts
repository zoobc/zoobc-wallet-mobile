import { Component, OnInit } from '@angular/core';

import { Platform, ToastController, AlertController, NavController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LanguageService } from 'src/app/Services/language.service';
import { AboutPage } from './Pages/about/about.page';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyService } from 'src/app/Services/currency.service';
import {
  STORAGE_OPENEXCHANGE_RATES,
  STORAGE_TRX_FEES, STORAGE_ACTIVE_CURRENCY, NETWORK_LIST,
  STORAGE_SELECTED_NODE, CONST_DEFAULT_CURRENCY
} from 'src/environments/variable.const';
import { TransactionFeesService } from './Services/transaction-fees.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { NetworkService } from './Services/network.service';
import { TransactionService } from './Services/transaction.service';
import { StoragedevService } from './Services/storagedev.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { environment } from 'src/environments/environment';

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
    private navCtrl: NavController,
    private firestore: AngularFirestore,
    private strgSrv: StoragedevService,
    private trxFeeService: TransactionFeesService,
    private transactionService: TransactionService,
    private translateService: TranslateService,
    private oneSignal: OneSignal,
    private alertCtrl: AlertController,
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

     // if (this.platform.is('cordova')) {
      this.setupPush();
      //}

      this.splashScreen.hide();
    });
  }

  async setDefaultCurrency() {
    const curr = await this.strgSrv.get(STORAGE_ACTIVE_CURRENCY);
    if (curr === null) {
      await this.strgSrv.set(STORAGE_ACTIVE_CURRENCY, CONST_DEFAULT_CURRENCY);
    }
    console.log('=== Active Currency: ', curr);
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
        await this.strgSrv.set(STORAGE_TRX_FEES, allFees);
      }
    });

  }

  async setNodes() {
    const node = await this.strgSrv.get(STORAGE_SELECTED_NODE);
    if (!node) {
      await this.strgSrv.set(STORAGE_SELECTED_NODE, NETWORK_LIST[0].domain);
      this.transactionService.loadRpcUrl();
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
  //     // console.log(' Error on app components: ', error);
  //   });
  // }

  // getCurrencyRateList() {
  //   this.currencyService.getCurrencyRateFromThirdParty().subscribe(async (res: any) => {
  //     // console.log('==xxxx  currencyRate timestamp 2: ', res.timestamp);
  //     if (res) {
  //       this.currencyService.setCurrencyRateList(res);
  //       await this.storage.set(OPENEXCHANGE_RATES_STORAGE, res);
  //     } else {
  //       this.currencyService.setCurrencyRateList(await this.storage.get(OPENEXCHANGE_RATES_STORAGE));
  //     }
  //   });
  // }

  async presentNotificationToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  async presentNoConnectionToast() {
    const toast = await this.toastController.create({
      message: this.connectionText,
      duration: 3000
    });
    toast.present();
  }


  async getExchangeRateList() {
    const rates = await this.strgSrv.get(STORAGE_OPENEXCHANGE_RATES);
    if (rates !== null) {
      this.currencyService.setCurrencyRateList(rates);
    } else {
      const rtFromGoogle = this.readExchangeRates().subscribe(async data => {
        data.map(async e => {
          // tslint:disable-next-line:no-string-literal
          const res = await JSON.parse(e.payload.doc.data()['rate0']);
          return res;
        });
      });

      this.currencyService.setCurrencyRateList(rtFromGoogle);
      await this.strgSrv.set(STORAGE_OPENEXCHANGE_RATES, rtFromGoogle);
    }
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

  setupPush() {
    this.oneSignal.startInit(environment.signalID, environment.appID);
    // this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
    // this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      const msg = data.payload.body;
      const title = data.payload.title;
      const additionalData = data.payload.additionalData;
      this.presentNotificationToast(msg);
      this.showAlert(title, msg, additionalData.task);
    });

    // Notification was really clicked/opened
    this.oneSignal.handleNotificationOpened().subscribe(data => {
      // Just a note that the data is a different place here!
      const additionalData = data.notification.payload.additionalData;
      this.presentNotificationToast('YOu already read this');
      this.showAlert('Notification opened', 'You already read this before', additionalData.task);
    });

    this.oneSignal.endInit();
  }

  async showAlert(title, msg, task) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `Action: ${task}`,
          handler: () => {

            this.navCtrl.navigateForward('/');
            // E.g: Navigate to a specific screen
          }
        }
      ]
    });

    alert.present();
  }

}
