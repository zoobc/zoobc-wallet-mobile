import { Component, OnInit } from '@angular/core';
import { MnemonicsService } from 'src/app/Services/mnemonics.service';
import { ModalController, LoadingController } from '@ionic/angular';
import { CreateAccountService } from 'src/app/Services/create-account.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/Services/auth-service';
import { SetupPinPage } from 'src/app/Pages/setup-pin/setup-pin.page';
import { doEncrypt, doDecrypt} from '../../Helpers/converters';
import { Storage } from '@ionic/storage';
import CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-existing-wallet',
  templateUrl: './existing-wallet.page.html',
  styleUrls: ['./existing-wallet.page.scss']
})
export class ExistingWalletPage implements OnInit {
  public passphrase: any;
  public errorMsg: string;
  private isValidPhrase: boolean;
  public wordCounter: number;
  public mnemonicWordLengtEnv: number = environment.mnemonicNumWords;
  public loginFail = false;
  // public arrayClass = [];
  public arrayPhrase = [];
  // public disabledBox = [];
  
  constructor(
    public loadingController: LoadingController,
    private mnemonicServ: MnemonicsService,
    private router: Router,
    private location: Location,
    private authSrv: AuthService,
    private storage: Storage,
    private modalController: ModalController,
    private createAccSrv: CreateAccountService
  ) {}

  ngOnInit() {
    this.errorMsg = '';
    this.isValidPhrase = true;
    this.wordCounter = 0;

    this.resetForm();

  }

  resetForm(){
    for (let i = 0; i < 24; i++) {
      this.arrayPhrase[i] = '';
    }
  }

  comparePassphrase(){
    console.log(" ==== changed ");
  }

  onPaste(event: ClipboardEvent) {
    console.log("Oke punya");

    let clipboardData = event.clipboardData;
    let passphrase = clipboardData.getData('text').toLowerCase();
    let phraseWord = passphrase.trim().split(' ');

    setTimeout(() => {
      this.resetForm();
    }, 200);

    setTimeout(() => {
      this.arrayPhrase = phraseWord;
    }, 300);

  }

  // onChangeMnemonic() {
  //   this.passphrase = this.arrayPhrase.toString();
  //   console.log('===== this.passphraseField', this.passphrase);

  //   if (!this.passphrase) {
  //     this.errorMsg = '';
  //     return;
  //   }

  //   this.isValidPhrase = this.mnemonicServ.validateMnemonic(this.passphrase);
  //   console.log('===== this.isValidPhrase', this.isValidPhrase);

  //   const mnemonicNumLength = this.passphrase.trim().split(' ').length;
  //   this.wordCounter = mnemonicNumLength;
 
  //   if (!this.isValidPhrase) {
  //     if (mnemonicNumLength < 1) {
  //       this.errorMsg = '';
  //     } else {
  //       this.errorMsg = 'Passphrase not valid';
  //     }

  //   } else {
  //     this.errorMsg = '';
  //   }
  // }

  openExistingWallet() {
    let haveEmpty = false;

    this.passphrase = "";
    for (let i = 0; i < this.arrayPhrase.length; i++) {
          const val = this.arrayPhrase[i];         
          if (!val){
              haveEmpty = true;
              break;
          }
          this.passphrase +=  val;
          if (i < 23){
              this.passphrase += " ";
          }
    }

    if (haveEmpty) {
      this.errorMsg = 'Please fill in all field!';
      return;
    }
    // this.passphrase = this.passphrase.trim();
    
    console.log('===== this.passphrase: ', this.passphrase);

    this.isValidPhrase = this.mnemonicServ.validateMnemonic(this.passphrase);
    if (!this.isValidPhrase) {
      this.errorMsg = 'Passphrase is not valid';
      return;
    }
    this.errorMsg = '';

    this.inputPIN();
  }


  async savePIN(pin: string) {
    console.log('==== Pin:', pin);

    console.log('==== this.passphrase:', this.passphrase);
    this.createAccSrv.setPassphrase(this.passphrase);

    console.log('==== setPin:', pin);
    await this.createAccSrv.setPin(pin);
    await this.createAccSrv.createAccount();

    const loginStatus = await this.authSrv.login(pin);
    console.log('==== loginstatus: ', loginStatus);
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

  async inputPIN() {
    const pinmodal = await this.modalController.create({
      component: SetupPinPage,
      cssClass: 'modal-ZBC'
    });

    pinmodal.onDidDismiss().then((returnedData) => {
      console.log('============= returned Data: ', returnedData);
      if (returnedData && returnedData.data && returnedData.data.length === 6) {

        const PIN = returnedData.data;
        this.savePassphrase(PIN, this.passphrase);
        this.savePIN(PIN);


      } else {
        console.log('==== PIN canceled ');
      }
    });

    return await pinmodal.present();
  }

  async savePassphrase(PIN: any, passphrase: any) {
        console.log('=== PIN', PIN);
        console.log('==== passphrase:', passphrase);
        const encrypted = doEncrypt(passphrase, PIN);

        await this.storage.set('PASS_STORAGE', encrypted);

        const passEncryptSaved = await this.storage.get('PASS_STORAGE');

        console.log('===== encrypted: ', encrypted);
        console.log('===== passEncryptSaved: ', passEncryptSaved);

        console.log('===== encrypted length: ', encrypted.length);
        console.log('===== passEncryptSaved Length: ', passEncryptSaved.length);

        if (passEncryptSaved === encrypted){
            console.log(" sama saja bos");
        }
        const decrypted =  doDecrypt(passEncryptSaved, PIN);
        console.log('dec:', decrypted);
        console.log('===== decrypted: ', decrypted.toString(CryptoJS.enc.Utf8));
  }

  goback() {
    this.location.back();
  }
}
