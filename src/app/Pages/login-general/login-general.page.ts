import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/Services/auth-service';

@Component({
  selector: 'app-login-general',
  templateUrl: './login-general.page.html',
  styleUrls: ['./login-general.page.scss'],
})
export class LoginGeneralPage implements OnInit {

  private start = 0;
  public pin = '';
  public pin2 = [];

  public isLoginValid = true;
  constructor(
    private authService: AuthService,
    private modalController: ModalController,
    private loadingController: LoadingController  ) {
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
  }

  async ngOnInit() {
    this.initialPin();
    // const acc = await this.accountService.getCurrAccount();
    // if (acc === null) {
    //   this.router.navigate(['initial']);
    //   return;
    // }

    // const isLoggedIn = this.authService.isLoggedIn();
    // if (isLoggedIn) {
    //   this.navCtrl.navigateRoot('/tabs/home');
    // }
  }

  handleInput(bar: any) {
    if (this.pin.length === 6) {
      return;
    }

    this.pin += bar;
    this.pin2[this.start] = '*';

    if (this.pin.length === 6) {
      this.login(this.pin);
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
    this.isLoginValid = true;
    const isUserLoggedIn = await this.authService.login(pin);
    if (isUserLoggedIn) {
      this.modalController.dismiss(pin);
    } else {
      this.isLoginValid = false;
      setTimeout(() => {
        this.isLoginValid = true;
      }, 1500);
    }

    await loading.dismiss();
  }

  async cancel() {
    await this.modalController.dismiss('-');
  }

}
