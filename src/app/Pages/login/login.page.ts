import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  public isLoginValid = true;
  public loginFail = false;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {}

  async login(e: any) {
    const { observer, pin, first } = e;

    if (first === true) {
      this.isLoginValid = true;
      return;
    }

    const isUserLoggedIn = await this.authService.login(pin);
    if (isUserLoggedIn) {
      this.isLoginValid = true;
      this.router.navigate(['tabs']);
      setTimeout(() => {
        observer.next(true);
      }, 500);
    } else {
      this.loginFail = true;
      setTimeout(() => {
        this.isLoginValid = false;
        observer.next(true);
       }, 500);
    }
  }

  createAccount() {
    this.router.navigate(['initial']);
  }

}
