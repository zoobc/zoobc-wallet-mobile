import { Component, OnInit } from '@angular/core';
import { KeyringService } from '../core/keyring.service';
import { ToastController } from '@ionic/angular';
import { MnemonicsService } from '../core/mnemonics.service';
import { Storage } from '@ionic/storage';
import { CryptoService } from 'src/services/crypto.service';
import { ConverterService } from 'src/services/converter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-passphrase',
  templateUrl: './generate-passphrase.page.html',
  styleUrls: ['./generate-passphrase.page.scss'],
})
export class GeneratePassphrasePage implements OnInit {

  private writtenDown = false
  private terms = false
  private setupPin = false
  private passphrase
  private isPinSetup = false


  constructor(
    private keyringService: KeyringService,
    private toastController: ToastController,
    private mnemonicsService: MnemonicsService,
    private storage: Storage,
    private cryptoService: CryptoService,
    private converterService: ConverterService,
    private router: Router
  ) { }

  ngOnInit() {
    this.checkSetupPin()
    this.generatePassphrase()
  }

  async checkSetupPin() {
    const pin = await this.storage.get('pin')
    if(pin) {
      this.isPinSetup = true
    } else {
      this.isPinSetup = false
    }
  }

  async goToAccount() {
    const pin = await this.storage.get('pin')
    const savedKey = await this.storage.get('encrypted_key')
    const privKeyUint8 = await this.cryptoService.rootKeyFromSeed(this.converterService.hexToArrayByte(this.passphrase))
    const pinUint8 = this.converterService.stringToArrayByte(pin)

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

    const wrappedKey = await this.cryptoService.wrapKeyWithPin(privKeyUint8, pinUint8, opts)

    this.storage.set('encrypted_key', [...savedKey, wrappedKey])
    this.router.navigate(['/'])
  }

  generatePassphrase() {
    this.passphrase = this.keyringService.generateRandomPhrase().phrase
    const privateKey = this.mnemonicsService.mnemonic.toSeed(this.passphrase, null)
    this.storage.set('private_key', privateKey)
  }

  copyToClipboard() {
    const val = this.passphrase

    let selBox = document.createElement('textarea');
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

    this.copyToast()
  }

  async copyToast() {
    const toast = await this.toastController.create({
      message: 'Passphrase copied to clipboard',
      duration: 2000
    });
    toast.present();
  }

  test() {
    this.mnemonicsService.mnemonic.toSeed(this.passphrase, null)
  }

}
