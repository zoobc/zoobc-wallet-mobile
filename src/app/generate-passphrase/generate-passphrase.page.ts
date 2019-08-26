import { Component, OnInit, Inject } from "@angular/core";
import { KeyringService } from "../core/keyring.service";
import { ToastController, NavController } from "@ionic/angular";
import { MnemonicsService } from "../core/mnemonics.service";
import { Storage } from "@ionic/storage";
import { CryptoService } from "src/services/crypto.service";
import { ConverterService } from "src/services/converter.service";
import { Router } from "@angular/router";
import { ObservableService } from "src/services/observable.service";
import { ACTIVE_ACCOUNT } from "src/environments/variable.const";
import { CreateAccountService } from "../Services/create-account.service";
import { AuthService } from "src/services/auth-service";
// import * as bip32 from 'bip32'
// import { calcBip32ExtendedKey } from '../core/keyring.service';
// import { arrayByteToHex, stringToArrayByte } from '../../helpers/converters'

@Component({
  selector: "app-generate-passphrase",
  templateUrl: "./generate-passphrase.page.html",
  styleUrls: ["./generate-passphrase.page.scss"]
})
export class GeneratePassphrasePage implements OnInit {
  writtenDown = false;
  terms = false;
  passphrase: string;
  isPinSetup = false;

  private account;

  pagePosition: number = 1;
  pageStep: number = 1;
  tempPin: string = "";

  constructor(
    private keyringService: KeyringService,
    private toastController: ToastController,
    private mnemonicsService: MnemonicsService,
    private storage: Storage,
    private cryptoService: CryptoService,
    private converterService: ConverterService,
    private Obs: ObservableService,
    private router: Router,
    private createAccSrv: CreateAccountService,
    private navCtrl: NavController,
    private authSrv: AuthService,
    @Inject("nacl.sign") private sign: any
  ) {}

  ngOnInit() {
    //this.checkSetupPin();
    this.generatePassphrase();
  }

  setupPin(event: any) {
    this.tempPin = event.pin;
    this.pagePosition++;
    this.pageStep++;
  }

  async confirmPin(event: any) {
    const pin = event.pin;
    if (this.tempPin === pin) {
      this.createAccSrv.setPassphrase(this.passphrase);
      this.createAccSrv.setPin(pin);
      await this.createAccSrv.createAccount();
      const loginStatus = await this.authSrv.login(pin);
      if (loginStatus) {
        this.navCtrl.navigateForward("/");
      }
    } else {
      this.presentToast("Your Pin in not same");
    }
  }

  setPagePosition(value) {
    this.pagePosition = value;
  }

  /*
  async checkSetupPin() {
    const pin = await this.storage.get("pin");
    if (pin) {
      this.isPinSetup = true;
    } else {
      this.isPinSetup = false;
    }
  }*/

  /*
  async goToAccount() {
    // const pin = await this.storage.get('pin')
    const savedKey = await this.storage.get("accounts");
    // const privKeyUint8 = await this.cryptoService.rootKeyFromSeed(this.converterService.hexToArrayByte(this.passphrase))
    // const pinUint8 = this.converterService.stringToArrayByte(pin)

    // const keyAlgo = {
    //   name: 'AES-GCM',
    //   length: 256,
    // }

    // const opts = {
    //   format: 'jwk',
    //   keyAlgo,
    //   wrapAlgo: {
    //     name: 'AES-GCM',
    //     iv: this.cryptoService.genInitVector(),
    //   },
    //   deriveAlgo: this.cryptoService.genDeriveAlgo(),
    // }

    // const wrappedKey = await this.cryptoService.wrapKeyWithPin(privKeyUint8, pinUint8, opts)

    this.storage.set("accounts", [...savedKey, this.account]);
    this.router.navigate(["/"]);
  }

  async goToSetupPin() {
    this.router.navigate(["/setup-pin"]);
  }*/

  async generatePassphrase() {
    const passphrase = this.keyringService.generateRandomPhrase().phrase;
    this.passphrase = passphrase;
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
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.writtenDown = false;
    this.terms = false;
  }
}
