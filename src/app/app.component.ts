import { Component, OnInit } from "@angular/core";

import { Platform, ToastController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { LanguageService } from "src/app/Services/language.service";
import { AboutPage } from "./Pages/about/about.page";
import { Network } from "@ionic-native/network/ngx";
import { TranslateService } from "@ngx-translate/core";
import { CurrencyService } from "src/app/Services/currency.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
  public rootPage: any = AboutPage;

  private connectionText = "";

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private languageService: LanguageService,
    private toastController: ToastController,
    private network: Network,
    private translateService: TranslateService,
    private currencyService: CurrencyService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.languageService.setInitialAppLanguage();
      this.currencyService.getCurrencyRates();
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
    this.network.onDisconnect().subscribe(() => {
      this.presentNoConnectionToast();
    });

    this.translateService
      .get("Please check your connection")
      .subscribe((res: string) => {
        this.connectionText = res;
      });
  }
}
