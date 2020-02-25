import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth-service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  public isLoginValid = true;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {

    const acc =  await this.accountService.getCurrAccount();
    if (acc === null) {
      this.router.navigate(['initial']);
      return;
    }

    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn === true) {
      this.router.navigate(['tabs']);
      return;
    }
  }

  async login(e: any) {
    const {pin} = e;
    this.isLoginValid = true;
    const isUserLoggedIn =  await this.authService.login(pin);
    if (isUserLoggedIn) {
      this.router.navigate(['tabs']);
    } else {
      this.isLoginValid = false;
      setTimeout(() => {
        this.isLoginValid = true;
       }, 1500);
    }
  }

  createAccount() {
    this.router.navigate(['initial']);
  }

}
