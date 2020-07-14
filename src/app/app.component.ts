import { Component, OnInit } from '@angular/core';
import { Platform, ToastController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';
import {
  STORAGE_ACTIVE_CURRENCY, CONST_DEFAULT_CURRENCY,
  STORAGE_ACTIVE_THEME, CURRENCY_RATE_LIST, DEFAULT_THEME} from 'src/environments/variable.const';

import { OneSignal } from '@ionic-native/onesignal/ngx';
import { environment } from 'src/environments/environment';
import { Account } from 'src/app/Interfaces/account';
import * as firebase from 'firebase/app';
import { fbconfig } from 'src/environments/firebaseconfig';
import { NetworkService } from './Services/network.service';
import { StoragedevService } from './Services/storagedev.service';
import { LanguageService } from 'src/app/Services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyService } from 'src/app/Services/currency.service';
import { ThemeService } from './Services/theme.service';
import { FcmService } from './Services/fcm.service';
firebase.initializeApp(fbconfig);
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  // public rootPage: any = AboutPage;
  public currentAccount: Account;
  private connectionText = '';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    private network: Network,
    private fcmService: FcmService,
    private languageService: LanguageService,
    private networkService: NetworkService,
    private toastController: ToastController,
    private strgSrv: StoragedevService,
    private translateService: TranslateService,
    private currencyService: CurrencyService,
    private themeService: ThemeService  ) {
    this.initializeApp();
    // this.darkMode();
  }

  darkMode() {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    toggleDarkTheme(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addListener((mediaQuery) => toggleDarkTheme(mediaQuery.matches));

    // Add or remove the "dark" class based on if the media query matches
    function toggleDarkTheme(shouldAdd: boolean) {
      document.body.classList.toggle('dark', shouldAdd);
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.fcmService.initialize();
      this.languageService.setInitialAppLanguage();
      this.networkService.setInitialNetwork();
      this.currencyService.setCurrencyRateList(CURRENCY_RATE_LIST);
      this.setDefaultCurrency();
      if (this.platform.is('cordova')) {
        this.setupPush();
      }
      this.splashScreen.hide();
      this.setTheme();
    });
  }


  async setDefaultCurrency() {
    const curr = await this.strgSrv.get(STORAGE_ACTIVE_CURRENCY);
    if (curr === null) {
      await this.strgSrv.set(STORAGE_ACTIVE_CURRENCY, CONST_DEFAULT_CURRENCY);
    }
    console.log('=== Active Currency: ', curr);
  }

  async setTheme() {
    const activeTheme = await this.strgSrv.get(STORAGE_ACTIVE_THEME);
    if (!activeTheme || activeTheme === undefined) {
        await this.themeService.setTheme(DEFAULT_THEME);
    }
  }

  async presentNotificationToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500
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
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      const msg = data.payload.body;
      this.presentNotificationToast(msg);
      // this.showAlert(title, msg, additionalData.task);
    });

    // Notification was really clicked/opened
    this.oneSignal.handleNotificationOpened().subscribe(() => {
      this.presentNotificationToast('You already read this');
      // this.showAlert('Notification opened', 'You already read this before', additionalData.task);
    });

    this.oneSignal.endInit();
  }

  // async showAlert(title, msg, task) {
  //   const alert = await this.alertCtrl.create({
  //     header: title,
  //     subHeader: msg,
  //     buttons: [
  //       {
  //         text: `Action: ${task}`,
  //         handler: () => {

  //           this.navCtrl.navigateForward('/');
  //           // E.g: Navigate to a specific screen
  //         }
  //       }
  //     ]
  //   });

  //   alert.present();
  // }

}
