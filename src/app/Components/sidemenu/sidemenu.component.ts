import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import {
  LANGUAGES,
  SELECTED_LANGUAGE,
  CURRENCIES
} from 'src/environments/variable.const';
import { AccountService } from 'src/app/services/account.service';
import { LanguageService } from 'src/app/services/language.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { ActiveAccountService } from 'src/app/services/active-account.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
  accounts = [];
  languages = [];
  activeLanguage = 'en';
  activeAccount = '';

  activeCurrency = 'USD';
  currencies = [];

  constructor(
    private menuController: MenuController,
    private router: Router,
    private storage: Storage,
    private accountService: AccountService,
    private languageService: LanguageService,
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
    const account = await this.storage.get('active_account');
    this.activeAccount = account.accountName;
  }

  revealPassphrase() {
      //
  }

  openAboutView() {
    this.menuController.close('mainMenu');
    this.router.navigateByUrl('/about');
  }

  openListAccount() {
    this.router.navigateByUrl('/list-account');
  }

  openAddresBook() {
    this.menuController.close('mainMenu');
    this.router.navigateByUrl('/address-book');
  }

  openSendFeedbak() {
    this.router.navigateByUrl('/feedback');
  }

  openHelpSupport() {
    this.menuController.close('mainMenu');
    this.router.navigateByUrl('/help');
  }

  openNodeAdmin() {
    this.router.navigateByUrl('/node-admin');
  }

  openNotifications() {
    this.router.navigateByUrl('/notifications');
  }

  openMenu() {
    this.menuController.open('first');
  }

  goToGenerate() {
    this.router.navigate(['/create-account']);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  selectActiveCurrency() {
    if (this.accountService) {
      this.currencyService.setCurrency(this.activeCurrency);
    }
  }

  selectActiveLanguage() {
    console.log('this.activeLanguage', this.activeLanguage);
    this.languageService.setLanguage(this.activeLanguage);
  }

  async getActiveAccount() {
    const accounts = await this.storage.get('accounts');
    const account = await this.storage.get('active_account');
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
