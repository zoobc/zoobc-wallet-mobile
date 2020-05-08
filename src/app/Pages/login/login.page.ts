import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth-service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/Services/account.service';
import { ThemeService } from 'src/app/Services/theme.service';
import { DEFAULT_THEME } from 'src/environments/variable.const';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  public isLoginValid = true;
  theme = DEFAULT_THEME;
  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router,
    private themeSrv: ThemeService
  ) {

    // if account changed
    this.themeSrv.themeSubject.subscribe(() => {
      this.theme = this.themeSrv.theme;
    });

  }

  async ngOnInit() {
    this.theme = this.themeSrv.theme;
    const acc =  await this.accountService.getCurrAccount();
    if (acc === null) {
      this.router.navigate(['initial']);
      return;
    }

    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn === true) {
      this.router.navigate(['/dashboard']);
      return;
    }
  }

  async login(e: any) {
    const {pin} = e;
    this.isLoginValid = true;
    const isUserLoggedIn =  await this.authService.login(pin);
    if (isUserLoggedIn) {
      this.router.navigateByUrl('/dashboard');
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
