import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  async getCurrencyRates() {

    await this.storage.get(OPENEXCHANGE_CURR_LIST_STORAGE).then((strg) => {
      const rates = Object.keys(strg).map(currencyName => {
        const rate = {
          name: currencyName,
          value: strg[currencyName],
        };
        return rate;
      });
      console.log('== Rates on settings: ', rates);
      this.currencyRates = rates;

    });
  }

}
