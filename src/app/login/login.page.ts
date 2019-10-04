import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  private pin = '';
  public loginFail = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async login(e: any) {
    const { observer, pin, first } = e;

    // set loginFail false && clear error message
    if (first === true) {
       this.loginFail = false;
       return;
    }

    this.loginFail = false;
    const isUserLoggedIn = await this.authService.login(pin);
    if (isUserLoggedIn) {
      this.router.navigate(['tabs']);
      setTimeout(() => {
        observer.next(true);
      }, 500);
    } else {
      setTimeout(() => {
        observer.next(true);
        this.loginFail = true;
       }, 500);
    }
  }

  createAccount() {
    this.router.navigate(['initial']);
  }

}
