import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { SELECTED_LANGUAGE, LANGUAGES } from 'src/environments/variable.const';
import { StoragedevService } from './storagedev.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';

  public selectLanguageSubject: Subject<any> = new Subject<any>();

  constructor(
    private translate: TranslateService,
    private strgSrv: StoragedevService  ) { }

  private languages = LANGUAGES;

  setInitialAppLanguage() {
    const language = this.translate.getBrowserLang();
    this.setLanguage(language);

    // check if have selected language
    this.strgSrv.get(SELECTED_LANGUAGE).then(val => {
      if (val) {
        this.setLanguage(val);
      }
    });
  }

  getOne(languageCode: string){
    return this.languages.find(e => e.code === languageCode);
  }

  setLanguage(lng: string) {
    this.translate.use(lng);
    this.selected = lng;
    this.translate.setDefaultLang(lng);
    this.strgSrv.set(SELECTED_LANGUAGE, lng);
  }

  broadcastSelectLanguage(language:any) {
    this.selectLanguageSubject.next(language)
  }
}
