import { Injectable } from '@angular/core';
import { ToastController, ModalController, AlertController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ConfirmationPage } from '../Components/confirmation/confirmation.page';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class UtilService {

  constructor(
    private toastController: ToastController,
    private clipboard: Clipboard,
    private alertController: AlertController,
    private router: Router,
    private modalController: ModalController) { }

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
   * @param title is title
   * @param msg is message
   * @param status is status
   * @param path is path
   */
  public async showConfirmation(title: string, msg: string, status: boolean, path?: string) {
    const modal = await this.modalController.create({
      component: ConfirmationPage,
      componentProps: {
        title,
        status,
        msg
      }
    });

    modal.onDidDismiss().then(() => {
      if (path) {
        this.router.navigateByUrl(path);
      }
    });

    return await modal.present();
  }

  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

}
