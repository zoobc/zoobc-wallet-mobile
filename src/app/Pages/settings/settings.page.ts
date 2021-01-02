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
import { StorageService } from 'src/app/Services/storage.service';
import { ThemeService } from 'src/app/Services/theme.service';
import { Currency } from 'src/app/Interfaces/currency';
import { AuthService } from 'src/app/Services/auth-service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

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
    private strgSrv: StorageService,
    private languageService: LanguageService,
    private networkService: NetworkService,
    private themeSrv: ThemeService,
    private currencyService: CurrencyService,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private translateSrv: TranslateService
  ) {
    this.currencyService.currencySubject.subscribe((rate: Currency) => {
      this.currencyRate = rate;
    });

  }

  private textConfirmLogout: string;
  private textYes: string;
  private textCancel: string;

  async ngOnInit() {
    this.getCurrencyRates();
    this.currencyRate = this.currencyService.getRate();

    const activeLanguageCode = await this.strgSrv.get(SELECTED_LANGUAGE);
    this.activeLanguage = this.languageService.getOne(activeLanguageCode?activeLanguageCode:"en");

    const activeCurrencyCode = await this.strgSrv.get(STORAGE_ACTIVE_CURRENCY);
    this.activeCurrency = this.currencyService.getOne(activeCurrencyCode)

    this.activeNetwork = this.networks[await this.strgSrv.get(STORAGE_ACTIVE_NETWORK_IDX)].name;

    this.activeTheme = await this.strgSrv.get(STORAGE_ACTIVE_THEME);

    this.translateSrv.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateLang();
    });

    this.translateLang();
  }

  translateLang(){
    this.translateSrv.get([
      'are you sure want to logout?', 
      'logout', 
      'cancel', 
    ]).subscribe((res: any)=>{
      this.textConfirmLogout = res["are you sure want to logout?"];
      this.textYes = res["logout"];
      this.textCancel = res["cancel"];
    })
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

  async logout() {
    const alert = await this.alertCtrl.create({
      message: this.textConfirmLogout,
      buttons: [
        {
          text: this.textCancel,
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: this.textYes,
          handler: () => {
            this.authService.logout();
            this.router.navigateByUrl('/login');
          }
        }
      ]
    });

    await alert.present();
  }
}
