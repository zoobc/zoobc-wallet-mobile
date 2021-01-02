import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth-service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/Services/theme.service';
import { DEFAULT_THEME } from 'src/environments/variable.const';
import { AccountService } from 'src/app/Services/account.service';
import { NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  private start = 0;
  public pin = '';
  public pin2 = [];

  public isLoginValid = true;
  theme = DEFAULT_THEME;
  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router,
    private loadingController: LoadingController,
    private themeSrv: ThemeService,
    private navCtrl: NavController
  ) {
    // if theme changed
    this.themeSrv.themeSubject.subscribe(() => {
      this.theme = this.themeSrv.theme;
    });
  }


  initialPin() {
    this.start = 0;
    this.pin = '';
    this.pin2[0] = '_';
    this.pin2[1] = '_';
    this.pin2[2] = '_';
    this.pin2[3] = '_';
    this.pin2[4] = '_';
    this.pin2[5] = '_';
  }

  clear() {
    this.initialPin();
  }

  clearOne() {
    if (this.start > 0) {
      this.start--;
    }
    this.pin2[this.start] = '_';

    let l = this.pin.length;
    if (l > 0) {
      l = l - 1;
    }
    this.pin = this.pin.substring(0, l);
  }

  ionViewDidEnter() {
    this.theme = this.themeSrv.theme;
    if (!this.theme || this.theme === '' || this.theme === undefined) {
      this.theme = DEFAULT_THEME;
    }
  }

  async ngOnInit() {

    this.initialPin();
    this.theme = this.themeSrv.theme;
    if (!this.theme || this.theme === '' || this.theme === undefined) {
      this.theme = DEFAULT_THEME;
    }
    const acc = await this.accountService.getCurrAccount();
    if (acc === null) {
      this.router.navigate(['initial']);
      return;
    }

    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      this.navCtrl.navigateRoot('/tabs/home');
    }
  }

  handleInput(bar: any) {
    if (this.pin.length === 6) {
      return;
    }

    this.pin += bar;
    this.pin2[this.start] = '*';

    if (this.pin.length === 6) {
     // setTimeout(() => {
      this.login(this.pin);
      // }, 200);

      setTimeout(() => {
        this.initialPin();
      }, 1800);
      return;

    }
    this.start++;

  }

  async login(pin: string) {
    const loading = await this.loadingController.create({
      message: 'Loading ...',
      duration: 3000
    });
    await loading.present();

    // const { pin } = e;
    this.isLoginValid = true;
    const isUserLoggedIn = await this.authService.login(pin);
    if (isUserLoggedIn) {
      this.navCtrl.navigateRoot('/tabs/home');
    } else {
      this.isLoginValid = false;
      setTimeout(() => {
        this.isLoginValid = true;
      }, 1500);
    }

    await loading.dismiss();
  }
}
