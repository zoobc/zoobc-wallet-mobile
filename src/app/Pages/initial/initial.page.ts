import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/Services/language.service';
import { LANGUAGES, DEFAULT_THEME } from 'src/environments/variable.const';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from 'src/app/Services/theme.service';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.page.html',
  styleUrls: ['./initial.page.scss'],
})
export class InitialPage implements OnInit {

  activeLanguage = 'en';
  languages = [];
  appVersion: string;
  constructor(
    private router: Router,
    private appVersionService: AppVersion,
    private languageService: LanguageService,
    private themeSrv: ThemeService,
    private translate: TranslateService
  ) {

    this.languages = LANGUAGES;
    this.languageService.setLanguage(this.activeLanguage);
  }

  ngOnInit() {
    this.themeSrv.setTheme(DEFAULT_THEME);
    this.appVersionService.getVersionNumber().then(
      (versionNumber) => {
        this.appVersion = versionNumber;
      },
      (error) => {
        console.log(error);
      });
  }

  openSendFeedbak() {
    this.router.navigateByUrl('/feedback');
  }

  selectActiveLanguage() {
    this.translate.use(this.activeLanguage);
    this.translate.setDefaultLang(this.activeLanguage);
    this.languageService.setLanguage(this.activeLanguage);
  }

}
