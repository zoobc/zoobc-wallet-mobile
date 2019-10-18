import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service';
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
    console.log('---', e);
    const { observer, pin, first } = e;
    // set loginFail false && clear error message
    if (first === true) {
      this.isLoginValid = true;
      return;
    }

    const isUserLoggedIn = await this.authService.login(pin);
    if (isUserLoggedIn) {
      setTimeout(() => {
        // close modal and send code 1 = success
        this.modalController.dismiss(1);
        observer.next(true);
      }, 500);
    } else {
      setTimeout(() => {
        observer.next(true);
        this.isLoginValid = false;
      }, 500);
    }
  }

  async cancel() {
    await this.modalController.dismiss(0);
  }

}
