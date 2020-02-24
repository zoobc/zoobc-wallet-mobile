import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../../../Services/auth-service';
import { Router } from '@angular/router';
import { CreateAccountService } from 'src/app/Services/create-account.service';
import { Storage } from '@ionic/storage';
import { doEncrypt } from 'src/Helpers/converters';
import { AuthService } from 'src/app/Services/auth-service';

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
  constructor(
    private createAccSrv: CreateAccountService,
    private authSrv: AuthService,
    private router: Router
  ) {
    this.pagePosition = 0;
    this.processing = false;
  }

  ngOnInit() {
    this.plainPassphrase = this.createAccSrv.getPassphrase();
  }

  async confirmPin(event: any) {

    const { pin } = event;
    this.loginFail = false;
    this.processing = true;
    // const pin = event.pin;
    if (this.tempPin === pin) {
      this.createAccSrv.setPlainPassphrase(this.plainPassphrase);
      this.createAccSrv.setPlainPin(pin);
      await this.createAccSrv.createAccount();

      const loginStatus = this.authSrv.login(pin);
      if (loginStatus) {
        this.router.navigateByUrl('/');
        setTimeout(() => {
          this.processing = false;
        }, 5000);
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
    console.log('====event:', event);
    this.loginFail = false;
    this.tempPin = event.pin;
    this.processing = true;
    setTimeout(() => {
      this.pagePosition++;
      this.processing = false;
    }, 1500);
  }

}
