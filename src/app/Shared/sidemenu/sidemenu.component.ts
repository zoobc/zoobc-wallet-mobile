import { Component, OnInit } from "@angular/core";
import { MenuController, NavController, AlertController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import {
  ACTIVE_ACCOUNT,
  LANGUAGES,
  SELECTED_LANGUAGE,
  CURRENCIES
} from "src/environments/variable.const";
import { AccountService } from "src/app/Services/account.service";
import { LanguageService } from "src/app/Services/language.service";
import { CurrencyService } from "src/app/Services/currency.service";
import { Account } from "src/app/Interfaces/account";
import { ThemeService } from "src/app/Services/theme.service";

@Component({
  selector: "app-sidemenu",
  templateUrl: "./sidemenu.component.html",
  styleUrls: ["./sidemenu.component.scss"]
})
export class SidemenuComponent implements OnInit {
  accounts = [];
  languages = [];
  activeLanguage = "en";
  activeAccount = "";

  activeCurrency = "USD";
  currencies = [];

  activeCurrencySubject;

  constructor(
    private menuController: MenuController,
    private storage: Storage,
    private accountSrv: AccountService,
    private languageService: LanguageService,
    private navCtrl: NavController,
    private currencyService: CurrencyService,
    private themeSrv: ThemeService,
    private alertCtrl: AlertController
  ) {
    this.accountSrv.activeAccountSubject.subscribe({
      next: (acc: Account) => {
        this.activeAccount = acc.name;
      }
    });
  }

  async ngOnInit() {
    this.languages = LANGUAGES;
    this.activeLanguage = await this.storage.get(SELECTED_LANGUAGE);
    this.currencies = CURRENCIES;

    const account: Account = await this.accountSrv.getActiveAccount();

    this.activeAccount = account.name;

    this.activeCurrencySubject = this.currencyService.activeCurrencySubject.subscribe(
      currency => {
        this.activeCurrency = currency;
      }
    );
  }

  openAboutView() {
    this.navCtrl.navigateForward("about");
  }

  openAccount() {
    this.navCtrl.navigateForward("account");
  }

  openAddresBook() {
    this.navCtrl.navigateForward("address-book");
  }

  openSendFeedbak() {
    this.navCtrl.navigateForward("feedback");
  }

  openHelpSupport() {
    this.navCtrl.navigateForward("help");
  }

  openNodeAdmin() {
    this.navCtrl.navigateForward("node-admin");
  }

  openNotifications() {
    this.navCtrl.navigateForward("notifications");
  }

  openMenu() {
    this.menuController.open("first");
  }

  goToGenerate() {
    this.navCtrl.navigateForward("create-account");
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: "Confirmation!",
      message: "Are you sure want to logout?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: blah => {}
        },
        {
          text: "Yes",
          handler: () => {
            this.navCtrl.navigateForward("login");
          }
        }
      ]
    });

    await alert.present();
  }

  setActiveTheme(value) {
    this.themeSrv.theme = value;
  }

  selectActiveCurrency() {
    if (this.accountSrv) {
      this.currencyService.activeCurrency = this.activeCurrency;
    }
  }

  selectActiveLanguage() {
    console.log("this.activeLanguage", this.activeLanguage);
    this.languageService.setLanguage(this.activeLanguage);
  }
}
