import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/services/language.service';
import { LANGUAGES } from 'src/environments/variable.const';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.page.html',
  styleUrls: ['./initial.page.scss'],
})
export class InitialPage implements OnInit {

  activeLanguage = 'en';
  languages = [];

  constructor(
    private router: Router, private languageService: LanguageService, private translate: TranslateService
  ) {
    this.languages = LANGUAGES;
    this.languageService.setLanguage(this.activeLanguage);
  }

  ngOnInit() {

  }

  selectActiveLanguage() {
    this.translate.use(this.activeLanguage);
    this.translate.setDefaultLang(this.activeLanguage);
    console.log('== this.activeLanguage:', this.activeLanguage);
    this.languageService.setLanguage(this.activeLanguage);
  }

}
