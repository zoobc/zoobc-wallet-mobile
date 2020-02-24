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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {}

  async login(e: any) {
    const {pin} = e;
    console.log('=== Pin: ', pin);
    this.isLoginValid = true;
    const isUserLoggedIn = await this.authService.login(pin);
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
