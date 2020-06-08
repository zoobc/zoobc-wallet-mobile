import { Injectable } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ZooKeyring } from 'zoobc-sdk';
import { STORAGE_ENC_PASSPHRASE_SEED, SALT_PASSPHRASE } from 'src/environments/variable.const';
import { doDecrypt } from 'src/Helpers/converters';
import { StoragedevService } from './storagedev.service';
import CryptoJS from 'crypto-js';
import { ConfirmationPage } from '../Components/confirmation/confirmation.page';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class UtilService {
  private keyring: ZooKeyring;
  constructor(
    private toastController: ToastController,
    private clipboard: Clipboard,
    private router: Router,
    private modalController: ModalController,
    private storageService: StoragedevService) { }

  public copyToClipboard(arg: any) {
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

  private copyInBrowser(arg: any) {
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

  private async copySuccess() {
    const toast = await this.toastController.create({
      message: 'Copied to clipboard.',
      duration: 2000
    });

    toast.present();
  }

  /**
   * Confirmation page, if success set status = true otherwise false
   * @param title
   * @param msg
   * @param status
   * @param path
   */
  public async showConfirmation(title: string, msg: string, status: boolean, path: string) {
    const modal = await this.modalController.create({
      component: ConfirmationPage,
      componentProps: {
        title,
        status,
        msg
      }
    });

    modal.onDidDismiss().then(data => {
      console.log(data);
      this.router.navigateByUrl(path);
    });

    return await modal.present();
  }


  public async generateSeed(pin: any, path: number) {

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
