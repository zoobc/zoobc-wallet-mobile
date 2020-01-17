import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth-service';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { doDecrypt } from 'src/app/Helpers/converters';
import CryptoJS from 'crypto-js';
import { PinBackupPage } from './pin/pin-backup/pin-backup.page';

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
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  backupClick() {
    this.showInputPIN();
  }

  async showInputPIN() {

    const pinmodal = await this.modalController.create({
      component: PinBackupPage,
      componentProps: {
      }
    });


    pinmodal.onDidDismiss().then(async (returnedData) => {
      console.log('Pin: ', returnedData);


      if (returnedData && returnedData.data !== 0) {
        const pin = returnedData.data;
        const isUserLoggedIn = await this.authService.login(pin);
        console.log('================ isUserLoggedIn:', isUserLoggedIn);

        if (isUserLoggedIn) {
          this.getPassprase(pin);
          this.step = 2;
        }

      }
    });

    return await pinmodal.present();
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

  // async wrongPwdAlert() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Alert',
  //     message: 'You entered Wrong PIN.',
  //     buttons: ['OK']
  //   });

  //   await alert.present();
  // }

  pinMatch() {
    this.step = 3;
  }

  closePhrase() {
    this.step = 4;
  }

}
