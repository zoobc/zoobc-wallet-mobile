import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth-service';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { doDecrypt } from 'src/app/Helpers/converters';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-backup-phrase',
  templateUrl: './backup-phrase.page.html',
  styleUrls: ['./backup-phrase.page.scss'],
})
export class BackupPhrasePage implements OnInit {

  step = 1;
  isLoginValid = false;
  passSaved = '';
  passDecrypted = '';
  constructor(
    private storage: Storage,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) { }

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
          role: 'ok',
          handler: async data => {

         
            // if (isUserLoggedIn) {
            //   data.role = 'success';
            //   alert.dismiss(2);
            // } else {
            alert.dismiss(data);
            // }

          }
        }
      ]
    });

    alert.onDidDismiss().then(async (returnedData) => {
      console.log('ret: ', returnedData);

      console.log('Role:', returnedData.role);
      console.log('pwd: ', returnedData.data.values.password);

      if (returnedData && returnedData.role === 'ok') {
 
        const pin = returnedData.data.values.password;
        const isUserLoggedIn = await this.authService.login(pin);
        // console.log('================ isUserLoggedIn:', isUserLoggedIn);

        if (isUserLoggedIn) {
          this.getPassprase(pin);
          this.step = 2;
        } else {
          this.wrongPwdAlert();
        }

        // this.wrongPwdAlert();
        // this.step = 4;

        // this.showPassprase(data);

      

      }
    });

  
    await alert.present();




  }
 
  async getPassprase(arg: any) {
    console.log('==== PIN:', arg);

    const passEncryptSaved = await this.storage.get('PASS_STORAGE');
    this.passSaved = passEncryptSaved;
    console.log('===== passEncryptSaved: ', passEncryptSaved);
    console.log('===== passEncryptSaved Length: ', passEncryptSaved.length);

    const decryptedArray =  doDecrypt(passEncryptSaved, arg);
    console.log('decryptedArray:', decryptedArray);
    const decrypted = decryptedArray.toString(CryptoJS.enc.Utf8);
    this.passDecrypted = decrypted;
    console.log('===== decrypted: ', decrypted);

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
