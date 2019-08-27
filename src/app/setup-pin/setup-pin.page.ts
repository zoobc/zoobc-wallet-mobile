import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import sha512 from "crypto-js/sha512";
import { Router } from "@angular/router";
import { AuthService } from "src/services/auth-service";
import { CryptoService } from "src/services/crypto.service";
import { ConverterService } from "src/services/converter.service";
import { CreateAccountService } from "../services/create-account.service";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-setup-pin",
  templateUrl: "./setup-pin.page.html",
  styleUrls: ["./setup-pin.page.scss"]
})
export class SetupPinPage implements OnInit {
  private pin: number;

  constructor(
    private storage: Storage,
    private router: Router,
    private authService: AuthService,
    private cryptoService: CryptoService,
    private converterService: ConverterService,
    private createAccSrv: CreateAccountService,
    private navCtrl: NavController,
    private authSrv: AuthService
  ) {}

  ngOnInit() {
    // this.storeKey();
  }

  // async storeKey() {
  //   const seedHex = await this.storage.get('private_key');

  //   const privKeyUint8 = await this.cryptoService.rootKeyFromSeed(this.converterService.hexToArrayByte(seedHex))
  //   const pinUint8 = this.converterService.stringToArrayByte(this.pin)

  //   const keyAlgo = {
  //     name: 'AES-GCM',
  //     length: 256,
  //   }

  //   const opts = {
  //     format: 'jwk',
  //     keyAlgo,
  //     wrapAlgo: {
  //       name: 'AES-GCM',
  //       iv: this.cryptoService.genInitVector(),
  //     },
  //     deriveAlgo: this.cryptoService.genDeriveAlgo(),
  //   }

  //   const wrappedKey = await this.cryptoService.wrapKeyWithPin(privKeyUint8, pinUint8, opts)
  //   // this.cryptoService.wrapKeyWithPin()

  //   this.storage.set('encrypted_key', [wrappedKey])
  // }

  async savePin(e) {
    const { observer, pin } = e;

    setTimeout(() => {
      observer.next(true);
    }, 500);

    const encryptedPin = sha512(pin.toString()).toString();
    //await this.storage.set("pin", encryptedPin);
    //const isUserLoggedIn = await this.authService.login(pin);

    ///
    const _pin = encryptedPin;
    this.createAccSrv.setPin(_pin);
    await this.createAccSrv.createAccount();
    const loginStatus = await this.authSrv.login(_pin);
    if (loginStatus) {
      this.navCtrl.navigateForward("/");
    }
  }
}
