import { Component, OnInit, Inject } from '@angular/core';
import { KeyringService } from 'src/app/services/keyring.service';
import { ToastController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { CreateAccountService } from 'src/app/services/create-account.service';
import { AuthService } from 'src/app/services/auth-service';
import { doEncrypt, doDecrypt } from 'src/app/helpers/converters';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-generate-passphrase',
  templateUrl: './generate-passphrase.page.html',
  styleUrls: ['./generate-passphrase.page.scss']
})
export class GeneratePassphrasePage implements OnInit {
  writtenDown = false;
  terms = false;
  passphrase: string;
  isPinSetup = false;
  private account;
  pagePosition = 1;
  pageStep = 1;
  tempPin = '';
  public loginFail = false;

  constructor(
    private keyringService: KeyringService,
    private toastController: ToastController,
    private createAccSrv: CreateAccountService,
    private navCtrl: NavController,
    private authSrv: AuthService,
    private storage: Storage,
    @Inject('nacl.sign') private sign: any
  ) {}

  ngOnInit() {
    // this.checkSetupPin();
    this.generatePassphrase();
  }

  setupPin(event: any) {
    console.log('====event:', event);
    this.loginFail = false;
    const { first } = event;
    // set loginFail false && clear error message
    if (first === true) {
       return;
    }
    this.tempPin = event.pin;
    this.pagePosition++;
    this.pageStep++;
  }

  async confirmPin(event: any) {
    console.log('====event:', event);
    const { observer, pin, first } = event;
    this.loginFail = false;
    // set loginFail false && clear error message
    if (first === true) {
       return;
    }
    // const pin = event.pin;
    if (this.tempPin === pin) {
      this.createAccSrv.setPassphrase(this.passphrase);
      this.createAccSrv.setPin(pin);
      this.savePassphrase(pin, this.passphrase);
      await this.createAccSrv.createAccount();
      const loginStatus = await this.authSrv.login(pin);
      if (loginStatus) {
        this.navCtrl.navigateForward('/');
      }
    } else {
      this.loginFail = true;
      // this.presentToast('Your Pin is not same');
      setTimeout(() => {
        observer.next(true);
       }, 1000);
    }
  }


  async savePassphrase(PIN: any, passphrase: any) {
    console.log('=== PIN', PIN);
    console.log('==== passphrase:', passphrase);
    const encrypted = doEncrypt(passphrase, PIN);
    console.log('===== encrypted: ', encrypted);
    await this.storage.set('PASS_STORAGE', encrypted);
    const decrypted =  doDecrypt(encrypted, PIN);
    console.log('===== decrypted: ', decrypted.toString(CryptoJS.enc.Utf8));
  }

  setPagePosition(value) {
    this.pagePosition = value;
  }

  async generatePassphrase() {
    const passphrase = this.keyringService.generateRandomPhrase().phrase;
    this.passphrase = passphrase;
  }

  copyToClipboard() {
    const val = this.passphrase;

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

    this.presentToast('Passphrase copied to clipboard');
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  ionViewDidLeave(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.writtenDown = false;
    this.terms = false;
  }
}
