import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { CreateAccountService } from 'src/app/Services/create-account.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/Services/auth-service';
import { SetupPinPage } from 'src/app/Pages/setup-pin/setup-pin.page';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ZooKeyring } from 'zoobc';

@Component({
  selector: 'app-existing-wallet',
  templateUrl: './existing-wallet.page.html',
  styleUrls: ['./existing-wallet.page.scss']
})
export class ExistingWalletPage implements OnInit {
  plainPin: string;
  public passphrase: any;
  public errorMsg: string;
  private isValidPhrase: boolean;
  public wordCounter: number;
  public mnemonicWordLengtEnv: number = environment.mnemonicNumWords;
  public loginFail = false;
  private lang: string;
  public arrayPhrase = [];
  constructor(
    public loadingController: LoadingController,
    private router: Router,
    private location: Location,
    private authSrv: AuthService,
    private modalController: ModalController,
    private createAccSrv: CreateAccountService
  ) {
    this.lang = 'english';
  }

  ngOnInit() {
    this.errorMsg = '';
    this.isValidPhrase = true;
    this.wordCounter = 0;
    this.resetForm();
  }

  resetForm() {
    for (let i = 0; i < 24; i++) {
      this.arrayPhrase[i] = '';
    }
  }

  comparePassphrase() {
    // console.log(' ==== changed ');
  }

  onPaste(event: ClipboardEvent) {
    // console.log('Oke punya');

    const clipboardData = event.clipboardData;
    const passphrase = clipboardData.getData('text').toLowerCase();
    const phraseWord = passphrase.trim().split(' ');

    setTimeout(() => {
      this.resetForm();
    }, 200);

    setTimeout(() => {
      this.arrayPhrase = phraseWord;
    }, 300);

  }

  openExistingWallet() {
    let haveEmpty = false;

    this.passphrase = '';
    for (let i = 0; i < this.arrayPhrase.length; i++) {
      const val = this.arrayPhrase[i].toLowerCase();
      if (!val) {
        haveEmpty = true;
        break;
      }
      this.passphrase += val;
      if (i < 23) {
        this.passphrase += ' ';
      }
    }

    if (haveEmpty) {
      this.errorMsg = 'Please fill in all field!';
      return;
    }

    this.isValidPhrase = ZooKeyring.isPassphraseValid(this.passphrase, this.lang);
    if (!this.isValidPhrase) {
      this.errorMsg = 'Passphrase is not valid';
      return;
    }

    this.createAccSrv.setPlainPassphrase(this.passphrase);

    this.errorMsg = '';
    this.showPinDialog();
  }

  async createAccount() {

    await this.createAccSrv.createInitialAccount();
    // console.log('=== create account existing this.ploian pin: ', this.plainPin);
    const loginStatus = this.authSrv.login(this.plainPin);
    // console.log('==== login status: ', loginStatus);
    if (loginStatus) {
      this.presentLoading();
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 2000,
      message: 'Please wait...',
      translucent: true
    });

    loading.onDidDismiss().then(() => {
      this.router.navigateByUrl('/');
    });

    return await loading.present();
  }

  async showPinDialog() {
    const pinmodal = await this.modalController.create({
      component: SetupPinPage,
      cssClass: 'modal-zbc'
    });

    pinmodal.onDidDismiss().then((returnedData) => {
      // console.log('===== returnedData: ', returnedData);
      if (returnedData && returnedData.data !== '-') {
        this.plainPin = returnedData.data;
        // set pin to service
        this.createAccSrv.setPlainPin(this.plainPin);
        this.createAccount();
      } else {
        // console.log('==== PIN canceled ');
      }
    });
    return await pinmodal.present();
  }

  goback() {
    this.location.back();
  }
}
