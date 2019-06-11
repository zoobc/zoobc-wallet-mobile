import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import sha512 from 'crypto-js/sha512';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth-service';
import { CryptoService } from 'src/services/crypto.service';
import { ConverterService } from 'src/services/converter.service';

@Component({
  selector: 'app-setup-pin',
  templateUrl: './setup-pin.page.html',
  styleUrls: ['./setup-pin.page.scss'],
})
export class SetupPinPage implements OnInit {
  private pin: number

  constructor(
    private storage: Storage,
    private router: Router,
    private authService: AuthService,
    private cryptoService: CryptoService,
    private converterService: ConverterService
  ) { }

  ngOnInit() {
    this.testFunction();
  }

  async testFunction() {
    const pin = "1234"
    const seedHex = "86d7324f71d22f56f244a4b2ca37000cbcb429fdcd173139534bc8526dfbebb29fb15e09bba7235100e1e89f33dcc9629e6286103aec559c10efaf22558c3474"

    const privKeyUint8 = await this.cryptoService.rootKeyFromSeed(this.converterService.hexToArrayByte(seedHex))
    console.log("passphraseUint8", privKeyUint8)
    const pinUint8 = this.converterService.stringToArrayByte(pin)
    console.log("pinUI8", pinUint8)

    const keyAlgo = {
      name: 'AES-GCM',
      length: 256,
    }

    const opts = {
      format: 'jwk',
      keyAlgo,
      wrapAlgo: {
        name: 'AES-GCM',
        iv: this.cryptoService.genInitVector(),
      },
      deriveAlgo: this.cryptoService.genDeriveAlgo(),
    }

    console.log("opts", opts)

    const test = await this.cryptoService.wrapKeyWithPin(privKeyUint8, pinUint8, opts)
    console.log("huhuhu", test)
    // this.cryptoService.wrapKeyWithPin()

    this.storage.set('encrypted_key', test)
  }

  async savePin() {
    console.log("test")
    const encryptedPin = sha512(this.pin.toString()).toString()
    this.storage.set("pin", encryptedPin)
    const isUserLoggedIn = await this.authService.login(this.pin)

    if(isUserLoggedIn) {
      this.router.navigate(['tabs'])
    }
  }
}
