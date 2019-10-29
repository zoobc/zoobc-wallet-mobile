import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import {
  LANGUAGES,
  SELECTED_LANGUAGE
} from 'src/environments/variable.const';
import { LanguageService } from 'src/app/Services/language.service';
import { CurrencyService, Currency } from 'src/app/Services/currency.service';
import { ActiveAccountService } from 'src/app/Services/active-account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
  public accounts = [];
  public languages = [];
  public activeLanguage = 'en';
  public activeCurrency = 'USD';
  public activeAccount = '';

  public currencyRate: Currency = {
    name: '',
    value: 0,
  };

  public currencyRates: Currency[];


  constructor(
    private menuController: MenuController,
    private router: Router,
    private storage: Storage,
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
    this.getCurrencyRates();

    this.currencyRate = this.currencyService.getRate();

    this.getActiveAccount();
    this.languages = LANGUAGES;
    this.activeLanguage = await this.storage.get(SELECTED_LANGUAGE);
    const account = await this.storage.get('active_account');
    this.activeAccount = account.accountName;
  }

  revealPassphrase() {
    this.menuController.close('mainMenu');
    this.router.navigateByUrl('/backup-phrase'); //
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

  getCurrencyRates() {
    this.currencyService.getCurrencyRateFromThirdParty().subscribe((res: any) => {
      console.log('============== Rec:', res);

      const rates = Object.keys(res.rates).map(currencyName => {
        const rate = {
          name: currencyName,
          value: res.rates[currencyName] * (environment.zbcPriceInUSD),
        };
        if (this.currencyRate.name === currencyName) {
          this.currencyRate.value = rate.value;
        }
        return rate;
      });
      rates.sort((a, b) => {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
      });

      this.currencyRates = rates;

      console.log('==== getCurrencyRates curency rates: ', this.currencyRates );
    });
  }


  changeRate() {
    console.log('============= activeCurrency:', this.activeCurrency);
    this.setCurrencyRate(this.activeCurrency);
    this.currencyService.changeRate(this.currencyRate);
    console.log('================ this.currencyRate', this.currencyRate);
  }

  setCurrencyRate(currCode: string) {
    this.currencyRates.forEach((rate) => {
      if (rate && rate.name === currCode) {
        this.currencyRate = rate;
      }
    });
  }

  selectActiveLanguage() {
    console.log('=============== this.activeLanguage', this.activeLanguage);
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
