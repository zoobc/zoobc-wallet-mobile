import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/Services/language.service';
import { CurrencyService, Currency } from 'src/app/Services/currency.service';
import { Storage } from '@ionic/storage';
import {
  LANGUAGES,
  SELECTED_LANGUAGE,
  OPENEXCHANGE_CURR_LIST_STORAGE
} from 'src/environments/variable.const';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public languages = [];
  public activeLanguage = 'en';
  public activeCurrency = 'USD';

  public currencyRate: Currency = {
    name: '',
    value: 0,
  };

  public currencyRates: Currency[];

  constructor(
    private storage: Storage,
    private languageService: LanguageService,
    private currencyService: CurrencyService) { }

  async ngOnInit() {
    this.getCurrencyRates();
    this.currencyRate = this.currencyService.getRate();
    this.languages = LANGUAGES;
    this.activeLanguage = await this.storage.get(SELECTED_LANGUAGE);
  }

  async getCurrencyRates() {

    await this.storage.get(OPENEXCHANGE_CURR_LIST_STORAGE).then((strg) => {
      const rates = Object.keys(strg).map(currencyName => {
        const rate = {
          name: currencyName,
          value: strg[currencyName],
        };
        if (this.currencyRate.name === currencyName) {
          this.currencyRate.value = rate.value;
        }
        return rate;
      });
      console.log('== Rates on settings: ', rates);
      this.currencyRates = rates;

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

}
