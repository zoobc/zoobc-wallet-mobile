import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth-service';
import { ModalController } from '@ionic/angular';
import { DEFAULT_THEME } from 'src/environments/variable.const';
import { ThemeService } from 'src/app/Services/theme.service';

@Component({
  selector: 'app-enterpinsend',
  templateUrl: './enterpinsend.page.html',
  styleUrls: ['./enterpinsend.page.scss'],
})
export class EnterpinsendPage implements OnInit {
  isLoginValid = true;
  theme = DEFAULT_THEME;
  constructor(private authService: AuthService,
              private modalController: ModalController,
              private themeSrv: ThemeService) {
    this.themeSrv.themeSubject.subscribe(() => {
      this.theme = this.themeSrv.theme;
    });
               }

  ngOnInit() {
    this.theme = this.themeSrv.theme;
    if (!this.theme) {
      this.theme = DEFAULT_THEME;
    }
  }

  ionViewDidEnter() {
    this.theme = this.themeSrv.theme;
    if (!this.theme || this.theme === '' || this.theme === undefined) {
      this.theme = DEFAULT_THEME;
    }
    console.log('=== ionViewDidEnter current theme: ', this.theme);
  }

  async login(e: any) {
    const {pin} = e;
    this.isLoginValid = true;

    const isUserLoggedIn =  await this.authService.login(pin);
    if (isUserLoggedIn) {
      this.modalController.dismiss(pin);
    } else {
      this.isLoginValid = false;
      setTimeout(() => {
        this.isLoginValid = true;
       }, 1500);
    }
  }

  async cancel() {
    await this.modalController.dismiss(0);
  }

}
