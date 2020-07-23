import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/Services/authentication.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss']
})
export class AuthenticationPage implements OnInit {
  formLogin = new FormGroup({
    email: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])
    ),
    password: new FormControl(
      '',
      Validators.compose([Validators.minLength(5), Validators.required])
    )
  });

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private alertCtrl: AlertController
  ) {}

  async login() {
    try {
      await this.authService.login(this.email.value, this.password.value);

      if (this.authService.currentRoute !== '') {
        this.navCtrl.navigateBack('/');
      }
    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'User not found.',
        buttons: ['OK']
      });

      await alert.present();
    }
  }

  ngOnInit() {}

  get email() {
    return this.formLogin.get('email');
  }

  get password() {
    return this.formLogin.get('password');
  }

  goToRegisterPage() {
    this.navCtrl.navigateForward('/authentication/register');
  }
}
