import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth-service';
import { DEFAULT_THEME } from 'src/environments/variable.const';
import { ThemeService } from 'src/app/Services/theme.service';
import { AccountService } from 'src/app/Services/account.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-setup-pin-gp',
  templateUrl: './setup-pin-gp.page.html',
  styleUrls: ['./setup-pin-gp.page.scss'],
})
export class SetupPinGpPage implements OnInit {
  public tempPin: string;
  public isLoginValid = true;
  public loginFail = false;
  public pagePosition: number;
  public plainPassphrase: any;
  public processing = false;
  public theme = DEFAULT_THEME;

  constructor(
    private accountSrv: AccountService,
    private authSrv: AuthService,
    private themeSrv: ThemeService,
    private navCtrl: NavController
  ) {
    this.pagePosition = 0;
    this.processing = false;
    // if theme changed
    this.themeSrv.themeSubject.subscribe(() => {
      this.theme = this.themeSrv.theme;
    });
  }

  ngOnInit() {
    this.plainPassphrase = this.accountSrv.getPassphrase();
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

  async confirmPin(event: any) {
    const { pin } = event;
    this.loginFail = false;
    this.processing = true;
    // const pin = event.pin;
    if (this.tempPin === pin) {
      this.accountSrv.setPlainPassphrase(this.plainPassphrase);
      this.accountSrv.setPlainPin(pin);
      await this.accountSrv.createInitialAccount();
      const loginStatus = await this.authSrv.login(pin);
      if (loginStatus) {
        setTimeout(() => {
          this.navCtrl.navigateRoot('/');
          this.processing = false;
        }, 100);
      }
    } else {
      this.loginFail = true;
      setTimeout(() => {
        this.loginFail = false;
        this.processing = false;
      }, 1500);
    }
  }

  setupPin(event: any) {
    this.loginFail = false;
    this.tempPin = event.pin;
    this.processing = true;
    setTimeout(() => {
      this.pagePosition++;
      this.processing = false;
    }, 1500);
  }
}
