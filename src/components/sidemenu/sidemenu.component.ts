import { Component, OnInit } from "@angular/core";
import { MenuController, NavController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { ObservableService } from "src/services/observable.service";
import {
  ACTIVE_ACCOUNT,
  LANGUAGES,
  SELECTED_LANGUAGE
} from "src/environments/variable.const";
import { AccountService } from "src/services/account.service";
import { LanguageService } from "src/services/language.service";

@Component({
  selector: "app-sidemenu",
  templateUrl: "./sidemenu.component.html",
  styleUrls: ["./sidemenu.component.scss"]
})
export class SidemenuComponent implements OnInit {
  accounts = [];
  languages = [];
  activeLanguage = "en";
  activeAccount = 0;

  constructor(
    private menuController: MenuController,
    private router: Router,
    private storage: Storage,
    private Obs: ObservableService,
    private accountService: AccountService,
    private languageService: LanguageService,
    private navCtrl: NavController
  ) {}

  ionViewWillEnter() {}

  async ngOnInit() {
    this.getListAccounts();
    console.log("ngOnInit");
    this.getActiveAccount();
    this.languages = LANGUAGES;
    this.activeLanguage = await this.storage.get(SELECTED_LANGUAGE);
  }

  openAboutView() {
    this.navCtrl.navigateForward("about");
  }

  openAddresBook() {
    this.navCtrl.navigateForward("addressbook");
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

  ngOnChanges() {
    this.getListAccounts();
  }

  openMenu() {
    this.menuController.open("first");
  }

  goToGenerate() {
    this.router.navigate(["/create-account"]);
  }

  async getListAccounts() {
    this.accounts = await this.storage.get("accounts");
    // accounts.forEach(account => {
    //   const address = this.accountService.getAccountAddress(
    //     account.accountProps
    //   );
    //   this.accounts.push({ ...account, address });
    // });
  }

  async selectAccount() {
    // this.Obs.Set(ACTIVE_ACCOUNT, this.accounts[this.activeAccount]);
    const account = await this.storage.set(
      "active_account",
      this.accounts[this.activeAccount]
    );
    console.log("account", account);
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
