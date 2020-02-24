import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth-service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pin-backup',
  templateUrl: './pin-backup.page.html',
  styleUrls: ['./pin-backup.page.scss'],
})
export class PinBackupPage implements OnInit {

  isLoginValid = true;

  constructor(private authService: AuthService, private modalController: ModalController, ) { }

  ngOnInit() {
  }

  async login(e: any) {
    const {pin} = e;
    console.log('=== Pin: ', pin);
    this.isLoginValid = true;
    const isUserLoggedIn = await this.authService.login(pin);
    if (isUserLoggedIn) {
      this.modalController.dismiss(pin);
    } else {
      this.isLoginValid = false;
      setTimeout(() => {
        this.isLoginValid = true;
       }, 1500);
    }
  }


  // async login(e: any) {
  //   console.log('---', e);
  //   const { observer, pin, first } = e;
  //   // set loginFail false && clear error message
  //   if (first === true) {
  //     this.isLoginValid = true;
  //     return;
  //   }

  //   const isUserLoggedIn = await this.authService.login(pin);
  //   if (isUserLoggedIn) {
  //     setTimeout(() => {
  //       // close modal and send code 1 = success
        
  //       observer.next(true);
  //     }, 500);
  //   } else {
  //     setTimeout(() => {
  //       observer.next(true);
  //       this.isLoginValid = false;
  //     }, 500);
  //   }
  // }

  async cancel() {
    await this.modalController.dismiss(0);
  }

}
