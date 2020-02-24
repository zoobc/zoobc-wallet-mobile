import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../../../Services/auth-service';
import { Router } from '@angular/router';
import { CreateAccountService } from 'src/app/Services/create-account.service';
import { Storage } from '@ionic/storage';
import { doEncrypt } from 'src/app/Helpers/converters';
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
  public passphrase: any;
  public processing = false;
  constructor(
    private createAccSrv: CreateAccountService,
    private storage: Storage,
    private authSrv: AuthService,
    private router: Router
  ) {
    this.pagePosition = 0;
    this.processing = false;
  }

  ngOnInit() {
    this.passphrase = this.createAccSrv.getPassphrase();
  }

  async confirmPin(event: any) {
    console.log('====event:', event);
    const { pin } = event;
    this.loginFail = false;
    this.processing = true;
    // const pin = event.pin;
    if (this.tempPin === pin) {
      console.log('=== passphrease: ', this.passphrase);
      console.log('=== pin: ', this.tempPin);

      this.createAccSrv.setPassphrase(this.passphrase);
      this.createAccSrv.setPin(pin);
      this.savePassphrase(pin, this.passphrase);
      await this.createAccSrv.createAccount();
      const loginStatus = await this.authSrv.login(pin);
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

  async savePassphrase(PIN: any, passphrase: any) {

    // console.log('=== PIN', PIN);
    // console.log('==== passphrase:', passphrase);
    const encrypted = doEncrypt(passphrase, PIN);
    // console.log('===== encrypted: ', encrypted);
    await this.storage.set('PASS_STORAGE', encrypted);

    // const decrypted =  doDecrypt(encrypted, PIN);
    // console.log('===== decrypted: ', decrypted.toString(CryptoJS.enc.Utf8));

  }


}
