import { Component, OnInit } from "@angular/core";
import { ToastController, NavController } from "@ionic/angular";
import { CreateAccountService } from "../../Services/create-account.service";
import { SetupPinService } from "src/app/Services/setup-pin.service";
import { AccountService } from "src/app/Services/account.service";
import * as bip39 from "bip39";
import { AuthService } from "src/app/Services/auth.service";

@Component({
  selector: "app-generate-passphrase",
  templateUrl: "./generate-passphrase.page.html",
  styleUrls: ["./generate-passphrase.page.scss"]
})
export class GeneratePassphrasePage implements OnInit {
  writtenDown = false;
  terms = false;
  passphrase: string;
  languages = [
    {
      key: "english",
      name: "English"
    },
    {
      key: "italian",
      name: "Italian"
    },
    {
      key: "french",
      name: "French"
    },
    {
      key: "spanish",
      name: "Spanish"
    },
    {
      key: "japanese",
      name: "Japan"
    },
    {
      key: "chinese_simplified",
      name: "Chinese Simplified"
    },
    {
      key: "chinese_traditional",
      name: "Chinese Traditional"
    },
    {
      key: "korean",
      name: "Korean"
    }
  ];

  constructor(
    private toastController: ToastController,
    private createAccSrv: CreateAccountService,
    private navCtrl: NavController,
    private authSrv: AuthService,
    private setupPinSrv: SetupPinService,
    private accountSrv: AccountService
  ) {}

  ngOnInit() {
    this.generatePassphrase();

    const wordlists = bip39.wordlists;

    this.setupPinSrv.setupPinSubject.subscribe(data => {
      const { status, pin } = data;

      if (status == "success") {
        this.setPin(pin);
      }
    });
  }

  onLanguageChanged(v) {
    bip39.setDefaultWordlist(v);
    this.generatePassphrase();
  }

  async setPin(pin: string) {
    await this.authSrv.clearAccount();

    const masterSeed = await this.accountSrv.setRootKey(
      this.createAccSrv.passphrase
    );

    const dataSignUp = {
      masterSeed
    };

    await this.authSrv.signUp(dataSignUp, pin);

    this.accountSrv.masterSeed = masterSeed;

    const account = await this.accountSrv.insert("Account 1");

    this.accountSrv.setActiveAccount(account);

    const authData = await this.authSrv.login(pin);

    if (authData) {
      this.navCtrl.navigateRoot("main/dashboard");
    }
  }

  setupPin() {
    this.createAccSrv.passphrase = this.passphrase;
    this.navCtrl.navigateForward("setup-pin");
  }

  async generatePassphrase() {
    const mnemonic = bip39.generateMnemonic(256);
    this.passphrase = mnemonic;

    this.writtenDown = false;
  }

  copyToClipboard() {
    const val = this.passphrase;

    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);

    this.presentToast("Passphrase copied to clipboard");
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  ionViewDidLeave(): void {
    this.writtenDown = false;
    this.terms = false;
  }
}
