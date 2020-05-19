import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateAccountService } from 'src/app/Services/create-account.service';
import { AuthService } from 'src/app/Services/auth-service';
import { DEFAULT_THEME } from 'src/environments/variable.const';
import { ThemeService } from 'src/app/Services/theme.service';

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
    private createAccSrv: CreateAccountService,
    private authSrv: AuthService,
    private router: Router,
    private themeSrv: ThemeService
  ) {
    this.pagePosition = 0;
    this.processing = false;
    // if theme changed
    this.themeSrv.themeSubject.subscribe(() => {
      this.theme = this.themeSrv.theme;
    });
  }

  ngOnInit() {
    this.plainPassphrase = this.createAccSrv.getPassphrase();
    this.theme = this.themeSrv.theme;
  }

  async confirmPin(event: any) {

    const { pin } = event;
    this.loginFail = false;
    this.processing = true;
    // const pin = event.pin;
    if (this.tempPin === pin) {

      this.createAccSrv.setPlainPassphrase(this.plainPassphrase);
      this.createAccSrv.setPlainPin(pin);
      await this.createAccSrv.createInitialAccount();
      const loginStatus = await this.authSrv.login(pin);
      if (loginStatus) {
        setTimeout(() => {
          this.router.navigateByUrl('/');
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
