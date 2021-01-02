import { Component, OnInit } from '@angular/core';
import { LANGUAGES, SELECTED_LANGUAGE } from 'src/environments/variable.const';
import { NavController } from '@ionic/angular';
import { LanguageService } from 'src/app/Services/language.service';
import { StorageService } from 'src/app/Services/storage.service';

@Component({
  selector: 'app-popup-languages',
  templateUrl: './popup-languages.page.html',
  styleUrls: ['./popup-languages.page.scss'],
})
export class PopupLanguagesPage implements OnInit {

  public languages = LANGUAGES;

  public activeLanguage = null;

  constructor(
    private navCtrl: NavController, 
    private languageSrv: LanguageService,  
    private strgSrv: StorageService
  ) { }

  async ngOnInit() {
    const activeLanguageCode = await this.strgSrv.get(SELECTED_LANGUAGE);
    this.activeLanguage = this.languageSrv.getOne(activeLanguageCode)
  }

  async languageClicked(language: any) {
    this.languageSrv.setLanguage(language.code)
    this.languageSrv.broadcastSelectLanguage(language)
    this.navCtrl.pop();
  }
}
