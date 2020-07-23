import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/Services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  registerForm = new FormGroup({
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
    private authService: AuthenticationService
  ) {}

  async register() {
    await this.authService.register(this.email.value, this.password.value);

    if (this.authService.currentRoute !== '') {
      this.navCtrl.navigateBack('/');
    }
  }

  ngOnInit() {}

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  goToLoginPage() {
    this.navCtrl.navigateBack('/authentication');
  }
}
