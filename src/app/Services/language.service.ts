import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SELECTED_LANGUAGE } from 'src/environments/variable.const';
import { StoragedevService } from './storagedev.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';

  constructor(
    private translate: TranslateService,
    private strgSrv: StoragedevService,
    private plt: Platform
  ) { }

  setInitialAppLanguage() {
    const language = this.translate.getBrowserLang();
    this.setLanguage(language);

    // check if have selected language
    this.strgSrv.get(SELECTED_LANGUAGE).then(val => {
      // console.log('==== val', language);
      if (val) {
        this.setLanguage(val);
      }
    });
  }

  setLanguage(lng: string) {
    this.translate.use(lng);
    this.selected = lng;
    this.translate.setDefaultLang(lng);
    this.strgSrv.set(SELECTED_LANGUAGE, lng);
  }
}
