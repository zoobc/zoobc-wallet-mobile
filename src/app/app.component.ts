import { Component, OnInit } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LanguageService } from 'src/services/language.service';
import { AboutPage } from './about/about.page';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  public rootPage: any = AboutPage

  private connectionText = '';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private languageService: LanguageService,
    private toastController: ToastController,
    private network: Network,
    private translateService: TranslateService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.languageService.setInitialAppLanguage();
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

    this.translateService.get('Please check your connection').subscribe((res: string) => {
      this.connectionText = res;
    });
  }


}
