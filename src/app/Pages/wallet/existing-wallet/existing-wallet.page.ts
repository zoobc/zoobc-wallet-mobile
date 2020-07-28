import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  LoadingController,
  NavController
} from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/Services/auth-service';
import { SetupPinPage } from 'src/app/Pages/wallet/existing-wallet/setup-pin/setup-pin.page';
import { Location } from '@angular/common';
import { ZooKeyring } from 'zoobc-sdk';
import { AccountService } from 'src/app/Services/account.service';
import { Account } from 'src/app/Interfaces/account';
import zoobc from 'zoobc-sdk';

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
    private authService: AuthService,
    public loadingController: LoadingController,
    private navCtrl: NavController,
    private location: Location,
    private authSrv: AuthService,
    private modalController: ModalController,
    private accountSrv: AccountService
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

  comparePassphrase() {}

  onPaste(event: ClipboardEvent) {
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

    this.isValidPhrase = ZooKeyring.isPassphraseValid(
      this.passphrase,
      this.lang
    );
    if (!this.isValidPhrase) {
      this.errorMsg = 'Passphrase is not valid';
      return;
    }

    this.accountSrv.setPlainPassphrase(this.passphrase);

    this.errorMsg = '';
    this.showPinDialog();
  }

  totalAccountLoaded = 20;
  async createAccount() {
    await this.accountSrv.createInitialAccount();

    /// add additional accounts begin
    const tempAccounts = [];

    for (let i = 1; i < this.totalAccountLoaded + 1; i++) {
      const account: Account = this.accountSrv.createNewAccount(
        `Account ${i + 1}`,
        i
      );
      tempAccounts.push(account.address);
    }

    try {
      const data = await zoobc.Account.getBalances(tempAccounts);

      const { accountbalancesList } = data;

      let exists = 0;
      for (let i = 0; i < tempAccounts.length; i++) {
        const account: Account = this.accountSrv.createNewAccount(
          `Account ${i + 1}`,
          i
        );

        await this.accountSrv.addAccount(account);

        const index = accountbalancesList.findIndex(
          (acc: any) => acc.address === account.address
        );

        if (
          accountbalancesList.findIndex(
            (acc: any) => acc.accountaddress === account.address
          ) >= 0
        ) {
          exists++;
        }

        if (exists >= accountbalancesList.length) {
          break;
        }
      }
    } catch (error) {
      console.log('__error', error);
    }
    /// add additional accounts end

    const loginStatus = this.authSrv.login(this.plainPin);
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
      this.navCtrl.navigateRoot('/');
    });

    return await loading.present();
  }

  async showPinDialog() {
    const pinmodal = await this.modalController.create({
      component: SetupPinPage,
      cssClass: 'modal-zbc'
    });

    pinmodal.onDidDismiss().then(returnedData => {
      if (returnedData && returnedData.data !== '-') {
        this.plainPin = returnedData.data;
        // set pin to service
        this.accountSrv.setPlainPin(this.plainPin);
        this.createAccount();
        this.authService.restoreAccounts();
      }
    });
    return await pinmodal.present();
  }

  goback() {
    this.location.back();
  }
}
