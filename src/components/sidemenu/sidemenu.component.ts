import { Component, OnInit } from "@angular/core";
import { MenuController, NavController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { ObservableService } from "src/app/services/observable.service";
import {
  ACTIVE_ACCOUNT,
  LANGUAGES,
  SELECTED_LANGUAGE,
  CURRENCIES
} from "src/environments/variable.const";
import { AccountService } from "src/app/services/account.service";
import { LanguageService } from "src/app/services/language.service";
import { CurrencyService } from "src/app/services/currency.service";
import { ActiveAccountService } from "src/app/services/active-account.service";

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
    private router: Router,
    private storage: Storage,
    private Obs: ObservableService,
    private accountService: AccountService,
    private languageService: LanguageService,
    private navCtrl: NavController,
    private currencyService: CurrencyService,
    private activeAccountSrv: ActiveAccountService
  ) {
    this.activeAccountSrv.accountSubject.subscribe({
      next: v => {
        this.activeAccount = v.accountName;
      }
    });
  }

  async ngOnInit() {
    this.getActiveAccount();
    this.languages = LANGUAGES;
    this.activeLanguage = await this.storage.get(SELECTED_LANGUAGE);
    this.currencies = CURRENCIES;

    const account = await this.storage.get("active_account");

    this.activeAccount = account.accountName;
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
    this.router.navigate(["/create-account"]);
  }

  logout() {
    this.router.navigate(["/login"]);
  }

  selectActiveCurrency() {
    if (this.accountService) {
      this.currencyService.setCurrency(this.activeCurrency);
    }
  }

  selectActiveLanguage() {
    console.log("this.activeLanguage", this.activeLanguage);
    this.languageService.setLanguage(this.activeLanguage);
  }

  async getActiveAccount() {
    const accounts = await this.storage.get("accounts");
    const account = await this.storage.get("active_account");
    accounts.forEach((acc, index) => {
      console.log(
        acc.accountProps.derivationPath === account.accountProps.derivationPath,
        acc.accountProps.derivationPath,
        account.accountProps.derivationPath
      );
      if (
        acc.accountProps.derivationPath === account.accountProps.derivationPath
      ) {
        this.activeAccount = index;
      }
    });
  }
}
