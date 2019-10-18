import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service';
import { ModalController, AlertController } from '@ionic/angular';


@Component({
  selector: 'app-backup-phrase',
  templateUrl: './backup-phrase.page.html',
  styleUrls: ['./backup-phrase.page.scss'],
})
export class BackupPhrasePage implements OnInit {

  step = 1;
  isLoginValid = false;

  constructor(private authService: AuthService, private alertCtrl: AlertController) { }

  ngOnInit() {

  }

  backupClick() {
    this.showInputPIN();
  }

  async showInputPIN() {


    const alert = await this.alertCtrl.create({
      header: 'Input PIN',
      inputs: [
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: async data => {

            console.log('================ Data login:', data);

            const isUserLoggedIn = await this.authService.login(data.password);
            console.log('================ isUserLoggedIn:', isUserLoggedIn);

            if (isUserLoggedIn) {
              this.step = 2;
              alert.dismiss(2);
            } else {
              this.step = 4;
              alert.dismiss(1);
            }

          }
        }
      ]
    });


    await alert.present();




  }

  async wrongPwdAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      message: 'You entered Wrong PIN.',
      buttons: ['OK']
    });

    await alert.present();
  }



  pinMatch() {
    this.step = 3;
  }

  closePhrase() {
    this.step = 4;
  }

}
