import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth-service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-enterpinsend',
  templateUrl: './enterpinsend.page.html',
  styleUrls: ['./enterpinsend.page.scss'],
})
export class EnterpinsendPage implements OnInit {
  isLoginValid = true;

  constructor(private authService: AuthService, private modalController: ModalController, ) { }

  ngOnInit() {
  }


  async login(e: any) {
    const {pin} = e;
    this.isLoginValid = true;

    const isUserLoggedIn =  await this.authService.login(pin);
    if (isUserLoggedIn) {
      this.modalController.dismiss(pin);
    } else {
      this.isLoginValid = false;
      setTimeout(() => {
        this.isLoginValid = true;
       }, 1500);
    }
  }

  async cancel() {
    await this.modalController.dismiss(0);
  }

}
