import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth-service';
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
    this.loginFail = false;
    if (first === true) {
       return;
    }
    const isUserLoggedIn = await this.authService.login(pin);
    if (isUserLoggedIn) {
      this.router.navigate(['tabs']);
      setTimeout(() => {
        observer.next(true);
      }, 500);
    } else {
      this.loginFail = true;
      setTimeout(() => {
        observer.next(true);
       }, 1000);
    }
  }

  createAccount() {
    this.router.navigate(['initial']);
  }

}
