import { Component, OnInit } from "@angular/core";
import { MenuController, NavController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { ObservableService } from "src/app/Services/observable.service";
import {
  ACTIVE_ACCOUNT,
  LANGUAGES,
  SELECTED_LANGUAGE,
  CURRENCIES
} from "src/environments/variable.const";
import { AccountService } from "src/app/Services/account.service";
import { LanguageService } from "src/app/Services/language.service";
import { CurrencyService } from "src/app/Services/currency.service";
import { ActiveAccountService } from "src/app/Services/active-account.service";
import { Account } from "src/app/Interfaces/account";

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

  constructor(
    private menuController: MenuController,
    private storage: Storage,
    private accountSrv: AccountService,
    private languageService: LanguageService,
    private navCtrl: NavController,
    private currencyService: CurrencyService,
    private activeAccountSrv: ActiveAccountService
  ) {
    this.activeAccountSrv.accountSubject.subscribe({
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
  }

  openAboutView() {
    this.navCtrl.navigateForward("about");
  }

  openListAccount() {
    this.navCtrl.navigateForward("list-account");
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

  logout() {
    this.navCtrl.navigateForward("login");
  }

  selectActiveCurrency() {
    if (this.accountSrv) {
      this.currencyService.setActiveCurrency(this.activeCurrency);
    }
  }

  selectActiveLanguage() {
    console.log("this.activeLanguage", this.activeLanguage);
    this.languageService.setLanguage(this.activeLanguage);
  }
}
