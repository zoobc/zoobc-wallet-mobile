import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/Services/language.service';
import { LANGUAGES, DEFAULT_THEME } from 'src/environments/variable.const';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ThemeService } from 'src/app/Services/theme.service';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.page.html',
  styleUrls: ['./initial.page.scss'],
})
export class InitialPage implements OnInit {

  activeLanguage:string;
  languages = [];
  constructor(
    private router: Router,
    private languageService: LanguageService,
    private themeSrv: ThemeService,
    private translate: TranslateService
  ) {

    this.languages = LANGUAGES;
  }

  ngOnInit() {
    this.themeSrv.setTheme(DEFAULT_THEME);
    this.activeLanguage = this.translate.currentLang;

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.activeLanguage = event.lang;
    });
  }

  openSendFeedbak() {
    this.router.navigateByUrl('/feedback');
  }

  selectActiveLanguage() {
    this.languageService.setLanguage(this.activeLanguage)
  }

  goToFeedback() {
    this.router.navigateByUrl('/feedback');
  }

}
