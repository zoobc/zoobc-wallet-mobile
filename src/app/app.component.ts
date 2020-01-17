import { Component, OnInit } from '@angular/core';

import { Platform, ToastController, AlertController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LanguageService } from 'src/app/Services/language.service';
import { AboutPage } from './Pages/about/about.page';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyService } from 'src/app/Services/currency.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  public rootPage: any = AboutPage;

  private connectionText = '';

  // private themeClassPrefix = "theme-";
  // defaultClassTheme: string = this.themeClassPrefix + environment.defaultTheme;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private languageService: LanguageService,
    private toastController: ToastController,
    private network: Network,
    private navCtrl: NavController,
    private translateService: TranslateService,
    private currencyService: CurrencyService,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.languageService.setInitialAppLanguage();
      // this.currencyService.getCurrencyRates();

      if (this.platform.is('cordova')) {

      }

      this.splashScreen.hide();
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
    // this.themeSrv.themeSubject.subscribe(value => {
    //   this.defaultClassTheme = this.themeClassPrefix + value;
    // });

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
