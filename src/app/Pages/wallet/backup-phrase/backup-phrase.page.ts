import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { PinBackupPage } from './pin/pin-backup/pin-backup.page';
import { STORAGE_ENC_PASSPHRASE_SEED } from 'src/environments/variable.const';
import { StoragedevService } from 'src/app/Services/storagedev.service';
import zoobc from 'zoobc-sdk';
import { UtilService } from 'src/app/Services/util.service';
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
    private utilService: UtilService,
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
      const passEncryptSaved = await this.strgSrv.get(STORAGE_ENC_PASSPHRASE_SEED);
      const passphrase = zoobc.Wallet.decryptPassphrase(passEncryptSaved, pin);
      if (passphrase) {
        this.decrypted = passphrase;
        this.passDecrypted = passphrase.split(' ');
      }
  }

  copyToClipboard() {
    const val = this.decrypted.slice();
    console.log('Value: ', val);
    this.utilService.copyToClipboard(val);
  }

  pinMatch() {
    this.step = 3;
  }

  closePhrase() {
    this.step = 4;
  }

}
