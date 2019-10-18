import { Component, OnInit } from '@angular/core';
import { MnemonicsService } from 'src/app/services/mnemonics.service';
import { NavController, ModalController } from '@ionic/angular';
import { CreateAccountService } from 'src/app/services/create-account.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth-service';
import { SetupPinPage } from 'src/app/setup-pin/setup-pin.page';
import { doEncrypt} from 'src/app/helpers/converters';
import { Storage } from '@ionic/storage';

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

  constructor(
    private mnemonicServ: MnemonicsService,
    private navCtrl: NavController,
    private authSrv: AuthService,
    private storage: Storage,
    private modalController: ModalController,
    private createAccSrv: CreateAccountService
  ) {}

  ngOnInit() {
    this.errorMsg = '';
    this.isValidPhrase = true;
    this.wordCounter = 0;
  }



  
  onChangeMnemonic() {
    console.log('===== this.passphraseField', this.passphrase);

    if (!this.passphrase) {
      this.errorMsg = '';
      return;
    }

    this.isValidPhrase = this.mnemonicServ.validateMnemonic(this.passphrase);
    console.log('===== this.isValidPhrase', this.isValidPhrase);

    const mnemonicNumLength = this.passphrase.trim().split(' ').length;
    this.wordCounter = mnemonicNumLength;
 
    if (!this.isValidPhrase) {
      if (mnemonicNumLength < 1) {
        this.errorMsg = '';
      } else {
        this.errorMsg = 'Passphrase not valid';
      }

    } else {
      this.errorMsg = '';
    }
  }

  openExistingWallet() {

    if (!this.passphrase) {
      this.errorMsg = 'Passphrase is ruquired!';
      return;
    }

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
      this.navCtrl.navigateForward('/');
    }
  }

  async inputPIN() {
    const pinmodal = await this.modalController.create({
      component: SetupPinPage
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
    console.log('===== encrypted: ', encrypted);
    await this.storage.set('PASS_STORAGE', encrypted);

    // const decrypted =  doDecrypt(encrypted, PIN);
    // console.log('===== decrypted: ', decrypted.toString(CryptoJS.enc.Utf8));

  }


  goback() {
    this.navCtrl.pop();
  }
}
