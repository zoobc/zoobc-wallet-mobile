import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CreateAccountService } from 'src/app/Services/create-account.service';
import * as bip39 from 'bip39';
import { Router } from '@angular/router';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { KeyringService } from 'src/app/Services/keyring.service';


@Component({
  selector: 'app-generate-passphrase',
  templateUrl: './generate-passphrase.page.html',
  styleUrls: ['./generate-passphrase.page.scss']
})
export class GeneratePassphrasePage implements OnInit {
  writtenDown = false;
  terms = false;
  plainPassphrase: string;
  arrayPhrase = [];
  isPinSetup = false;
  pagePosition = 1;
  pageStep = 1;
  tempPin = '';
  public loginFail = false;

  constructor(
    private router: Router,
    private clipboard: Clipboard,
    private keyringService: KeyringService,
    private toastController: ToastController,
    private createAccSrv: CreateAccountService
  ) { }

  ngOnInit() {
    // this.checkSetupPin();
    this.generatePassphrase();
  }

  onLanguageChanged(v) {
    bip39.setDefaultWordlist(v);
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

  passphraseConfirmation() {
    this.createAccSrv.setPlainPassphrase(this.plainPassphrase.slice());
    this.router.navigateByUrl('/create-wallet');
  }

  async generatePassphrase() {
    const passphrase = this.keyringService.generateRandomPhrase().phrase;
    this.plainPassphrase = passphrase;
    this.createAccSrv.setPlainPassphrase(this.plainPassphrase.slice());
    this.arrayPhrase = this.plainPassphrase.slice().split(' ');
    this.createAccSrv.setArrayPassphrase(this.arrayPhrase);
    console.log('Array phrase: ', this.arrayPhrase);
  }

  copyToClipboard() {
    const val = this.plainPassphrase.slice();
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


    this.clipboard.copy(strCopy);

    this.clipboard.paste().then(
      (resolve: string) => {
         // alert(resolve);
         this.presentToast('Passphrase copied to clipboard');
       },
       (reject: string) => {
        this.copyInBrowser(strCopy);
         // alert('Error: ' + reject);
       }
     );

  }

  copyInBrowser(arg: string) {

     const selBox = document.createElement('textarea');
     selBox.style.position = 'fixed';
     selBox.style.left = '0';
     selBox.style.top = '0';
     selBox.style.opacity = '0';
     selBox.value = arg;
     document.body.appendChild(selBox);
     selBox.focus();
     selBox.select();
     document.execCommand('copy');
     document.body.removeChild(selBox);

  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000
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
