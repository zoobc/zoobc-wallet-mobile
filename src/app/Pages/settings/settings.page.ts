import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/Services/language.service';
import { CurrencyService, ICurrency} from 'src/app/Services/currency.service';
import {
  LANGUAGES,
  SELECTED_LANGUAGE,
  CURRENCY_LIST,
  STORAGE_ACTIVE_CURRENCY,
  STORAGE_ACTIVE_NETWORK_IDX,
  NETWORK_LIST,
  THEME_OPTIONS,
  STORAGE_ACTIVE_THEME
} from 'src/environments/variable.const';
import { NetworkService } from 'src/app/Services/network.service';
import { getFormatedDate } from 'src/Helpers/converters';
import { StoragedevService } from 'src/app/Services/storagedev.service';
import { ThemeService } from 'src/app/Services/theme.service';
import { Currency } from 'src/app/Interfaces/currency';
import { AuthService } from 'src/app/Services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public Object = Object;
  public languages = LANGUAGES;
  public activeLanguage: any | null;
  public activeTheme: string;
  public activeCurrency: any;
  public activeNetwork: any;
  public currencyRateList: any;
  public currencyList = CURRENCY_LIST;
  public networks = NETWORK_LIST;
  public currencyRate: Currency;
  public timestamp: string;
  public themes = THEME_OPTIONS;

  constructor(
    private strgSrv: StoragedevService,
    private languageService: LanguageService,
    private networkService: NetworkService,
    private themeSrv: ThemeService,
    private currencyService: CurrencyService,
    private authService: AuthService,
    private router: Router) {

      this.currencyService.currencySubject.subscribe((rate: Currency) => {
        this.currencyRate = rate;
      });

    }

  async ngOnInit() {
    this.getCurrencyRates();
    this.currencyRate = this.currencyService.getRate();

    const activeLanguageCode = await this.strgSrv.get(SELECTED_LANGUAGE);
    this.activeLanguage = this.languageService.getOne(activeLanguageCode?activeLanguageCode:"en");

    const activeCurrencyCode = await this.strgSrv.get(STORAGE_ACTIVE_CURRENCY);
    this.activeCurrency = this.currencyService.getOne(activeCurrencyCode)

    this.activeNetwork = this.networks[await this.strgSrv.get(STORAGE_ACTIVE_NETWORK_IDX)].name;

    this.activeTheme = await this.strgSrv.get(STORAGE_ACTIVE_THEME);
  }

  private selectThemeSubscription = null;
  private selectNetworkSubscription = null;
  private selectLanguageSubscription = null;
  private selectCurrencySubscription = null;

  ionViewWillEnter() {
    this.selectThemeSubscription = this.themeSrv.themeSubject.subscribe((value: string)=>{
      this.activeTheme = value
    })

    this.selectNetworkSubscription = this.networkService.changeNodeSubject.subscribe((network: any)=>{
      this.activeNetwork = network.name
    })

    this.selectLanguageSubscription = this.languageService.selectLanguageSubject.subscribe((language: any)=>{
      this.activeLanguage = language
    })

    this.selectCurrencySubscription = this.currencyService.selectCurrencySubject.subscribe((currency: ICurrency)=>{
      this.activeCurrency = currency
    })
  }

  ionViewWillLeave() {
    if (this.selectThemeSubscription) {
      this.selectThemeSubscription.unsubscribe();
    }

    if (this.selectNetworkSubscription) {
      this.selectNetworkSubscription.unsubscribe();
    }

    if (this.selectLanguageSubscription) {
      this.selectLanguageSubscription.unsubscribe();
    }

    if (this.selectCurrencySubscription) {
      this.selectCurrencySubscription.unsubscribe();
    }
  }

  async getCurrencyRates() {
    this.currencyRateList = await this.currencyService.getCurrencyRateList();
    if (this.currencyRateList) {
      this.timestamp = getFormatedDate(this.currencyRateList.timestamp);
    }
  }

  goToMultisig(){
    this.router.navigateByUrl('/multisig');
  }

  goToTheme(){
    this.router.navigateByUrl('/theme');
  }

  goToNetwork(){
    this.router.navigateByUrl('/network');
  }

  goToCurrency(){
    this.router.navigateByUrl('/popup-currency');
  }

  goToLanguage(){
    this.router.navigateByUrl('/popup-languages');
  }

  goToSeedPhrase(){
    this.router.navigateByUrl('/backup-phrase');
  }

  goToBackupRestoreAddress(){
    this.router.navigateByUrl('/backuprestore-address');
  }
  
  goToHelpAndSupport(){
    this.router.navigateByUrl('/help');
  }

  goToFeedback(){
    this.router.navigateByUrl('/feedback');
  }

  goToAbout(){
    this.router.navigateByUrl('/about');
  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
