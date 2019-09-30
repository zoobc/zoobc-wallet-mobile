import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SELECTED_LANGUAGE } from 'src/environments/variable.const';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';

  constructor(
    private translate: TranslateService,
    private storage: Storage,
    private plt: Platform
  ) { }

  setInitialAppLanguage() {
    const language = this.translate.getBrowserLang();
    this.setLanguage(language);

    // check if have selected language
    this.storage.get(SELECTED_LANGUAGE).then(val => {
      console.log('==== val', language);
      if (val) {
        this.setLanguage(val);
      }
    });
  }

  getLanguages() {
    return [
      { text: 'English', value: 'en', img: 'assets/imgs/en.png' },
      { text: 'German', value: 'de', img: 'assets/imgs/de.png' }
    ];
  }

  setLanguage(lng: string) {
    this.translate.use(lng);
    this.selected = lng;
    this.translate.setDefaultLang(lng);
    this.storage.set(SELECTED_LANGUAGE, lng);
  }
}
