import { Platform } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { SELECTED_LANGUAGE } from 'src/environments/variable.const';

@Injectable({
    providedIn: "root"
})
export class LanguageService {
  selected = "";

  constructor(
    private translate: TranslateService,
    private storage: Storage,
    private plt: Platform
  ) {}

  setInitialAppLanguage() {
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);

    this.storage.get(SELECTED_LANGUAGE).then(val => {
      console.log("val", language)
      if (val) {
        this.setLanguage(val);
        this.selected = val;
      }
    });
  }

  getLanguages() {
    return [
      { text: "English", value: "en", img: "assets/imgs/en.png" },
      { text: "German", value: "de", img: "assets/imgs/de.png" }
    ];
  }

  setLanguage(lng) {
    this.translate.use(lng);
    this.selected = lng;
    this.storage.set(SELECTED_LANGUAGE, lng);
  }
}
