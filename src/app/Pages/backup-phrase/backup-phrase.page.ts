import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth-service';
import { ModalController, ToastController } from '@ionic/angular';
import { doDecrypt } from 'src/Helpers/converters';
import CryptoJS from 'crypto-js';
import { PinBackupPage } from './pin/pin-backup/pin-backup.page';
import { STORAGE_ENC_PASSPHRASE_SEED, STORAGE_ENC_MASTER_SEED } from 'src/environments/variable.const';
import { StoragedevService } from 'src/app/Services/storagedev.service';

@Component({
  selector: 'app-backup-phrase',
  templateUrl: './backup-phrase.page.html',
  styleUrls: ['./backup-phrase.page.scss'],
})
export class BackupPhrasePage implements OnInit {

  step = 1;
  isLoginValid = false;
  passSaved = '';
  passDecrypted = [];
  decrypted = '';
  constructor(
    private strgSrv: StoragedevService,
    private toastController: ToastController,
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
      cssClass: 'modal-zbc',
      componentProps: {
      }
    });


    pinmodal.onDidDismiss().then(async (returnedData) => {
      if (returnedData && returnedData.data !== '-') {
        const key = returnedData.data;
        this.getPassprase(key);
        this.step = 2;
      } else {
        this.step = 1;
      }
    });

    return await pinmodal.present();
  }

  async getPassprase(pin: any) {


      // console.log('==== pin backup:', pin);
      const passEncryptSaved = await this.strgSrv.get(STORAGE_ENC_PASSPHRASE_SEED);
      // console.log('==== passEncryptSaved:', passEncryptSaved);

      const isPinValid = this.authService.isPinValid(passEncryptSaved, pin);
      // console.log('==== isPinValid:', isPinValid);

      if (isPinValid) {
         const decryptedArray =  doDecrypt(passEncryptSaved, pin);

         // console.log('decryptedArray:', decryptedArray);
         this.decrypted = decryptedArray.toString(CryptoJS.enc.Utf8);
         // console.log('===== decrypted: ', this.decrypted);

         this.passDecrypted = this.decrypted.split(' ');

      }


    // console.log('==== PIN:', arg);

    // const passEncryptSaved = await this.storage.get('PASS_STORAGE');
    // this.passSaved = passEncryptSaved;
    // console.log('===== passEncryptSaved: ', passEncryptSaved);
    // console.log('===== passEncryptSaved Length: ', passEncryptSaved.length);

    // const decryptedArray =  doDecrypt(passEncryptSaved, arg);
    // console.log('decryptedArray:', decryptedArray);
    // this.decrypted = decryptedArray.toString(CryptoJS.enc.Utf8);
    // this.passDecrypted = this.decrypted.split(' ');
    // console.log('===== decrypted: ', this.decrypted);
  }

  // async wrongPwdAlert() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Alert',
  //     message: 'You entered Wrong PIN.',
  //     buttons: ['OK']
  //   });

  //   await alert.present();
  // }

  copyToClipboard() {
    const val = this.decrypted.slice();
    const arrayPass = val.split(' ');
    let strCopy = 'This is your ZooBC passphrase:\n\n With order number\n-------------------------\n';
    for (let i = 0; i < arrayPass.length; i++) {
      strCopy += (i + 1) + '.' + arrayPass[i];
      if (i < 23) {
        strCopy += ',   ';
      }
      if ((i + 1) % 3 === 0) {
        strCopy += '\n';
      }
    }
    strCopy += '\n\nWithout order number\n-------------------------\n' + val;
    strCopy += '\n\n----------- End ----------\n\n';

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = strCopy;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.copySuccess();
  }

  async copySuccess() {
    const toast = await this.toastController.create({
      message: 'Your address copied to clipboard.',
      duration: 2000
    });

    toast.present();
  }


  pinMatch() {
    this.step = 3;
  }

  closePhrase() {
    this.step = 4;
  }

}
