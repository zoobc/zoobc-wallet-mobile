import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth-service';
import { ModalController } from '@ionic/angular';
import { DEFAULT_THEME } from 'src/environments/variable.const';
import { ThemeService } from 'src/app/Services/theme.service';

@Component({
  selector: 'app-pin-backup',
  templateUrl: './pin-backup.page.html',
  styleUrls: ['./pin-backup.page.scss'],
})
export class PinBackupPage implements OnInit {

  isLoginValid = true;
  theme = DEFAULT_THEME;
  constructor(private authService: AuthService,
              private modalController: ModalController,
              private themeSrv: ThemeService) {
    // if theme changed
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
    await this.modalController.dismiss('-');
  }

}
