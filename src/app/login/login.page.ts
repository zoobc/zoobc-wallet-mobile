import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth-service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private pin
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  async login() {
    const isUserLoggedIn = await this.authService.login(this.pin);
    if(isUserLoggedIn) {
      this.router.navigate(['tabs']);
    } else {
      this.failedToast()
    }
  }

  async failedToast() {
    const toast = await this.toastController.create({
      message: 'Unlock Failed',
      duration: 2000
    });
    toast.present();
  }

}
