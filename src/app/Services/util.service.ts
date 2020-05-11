import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ZooKeyring } from 'zoobc';
import { STORAGE_ENC_PASSPHRASE_SEED, SALT_PASSPHRASE } from 'src/environments/variable.const';
import { doDecrypt } from 'src/Helpers/converters';
import { StoragedevService } from './storagedev.service';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private keyring: ZooKeyring;
  constructor(
    private toastController: ToastController,
    private clipboard: Clipboard,
    private storageService: StoragedevService) { }

  copyToClipboard(arg: any) {
    this.clipboard.copy(arg);
    this.clipboard.paste().then(
      () => {
        this.copySuccess();
      },
      () => {
        this.copyInBrowser(arg);
      }
    );
  }

  copyInBrowser(arg: any) {
    const val = arg;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.copySuccess();
  }

  async copySuccess() {
    const toast = await this.toastController.create({
      message: 'Copied to clipboard.',
      duration: 2000
    });

    toast.present();
  }


  async generateSeed(pin: any, path: number) {

    console.log('===== generateSeed, account.path: ', path);
    console.log('==== generateSeed pin :', pin);

    const passEncryptSaved = await this.storageService.get(STORAGE_ENC_PASSPHRASE_SEED);
    const decryptedArray = doDecrypt(passEncryptSaved, pin);
    const passphrase = decryptedArray.toString(CryptoJS.enc.Utf8);
    this.keyring = new ZooKeyring(passphrase, SALT_PASSPHRASE);
    const seed = this.keyring.calcDerivationPath(path);
    return seed;
  }

}
