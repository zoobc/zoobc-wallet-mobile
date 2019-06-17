import { Component, OnInit, Inject } from '@angular/core';
import { KeyringService } from '../core/keyring.service';
import { ToastController } from '@ionic/angular';
import { MnemonicsService } from '../core/mnemonics.service';
import { Storage } from '@ionic/storage';
import { CryptoService } from 'src/services/crypto.service';
import { ConverterService } from 'src/services/converter.service';
import { Router } from '@angular/router';
import { ObservableService } from 'src/services/observable.service';
import { ACTIVE_ACCOUNT } from 'src/environments/variable.const';
// import * as bip32 from 'bip32'
// import { calcBip32ExtendedKey } from '../core/keyring.service';
// import { arrayByteToHex, stringToArrayByte } from '../../helpers/converters'

@Component({
  selector: 'app-generate-passphrase',
  templateUrl: './generate-passphrase.page.html',
  styleUrls: ['./generate-passphrase.page.scss'],
})
export class GeneratePassphrasePage implements OnInit {

  private writtenDown = false
  private terms = false
  private passphrase
  private isPinSetup = false

  private account


  constructor(
    private keyringService: KeyringService,
    private toastController: ToastController,
    private mnemonicsService: MnemonicsService,
    private storage: Storage,
    private cryptoService: CryptoService,
    private converterService: ConverterService,
    private Obs: ObservableService,
    private router: Router,
    @Inject("nacl.sign") private sign: any
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
    // const pin = await this.storage.get('pin')
    const savedKey = await this.storage.get('accounts')
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

    this.storage.set('accounts', [...savedKey, this.account])
    this.router.navigate(['/'])
  }

  goToSetupPin() {
    this.Obs.Set(ACTIVE_ACCOUNT, this.account)
    this.storage.set('active_account', this.account)
    this.storage.set('accounts', [this.account])
    this.router.navigate(['/setup-pin'])
  }

  generatePassphrase() {
    this.passphrase = this.keyringService.generateRandomPhrase().phrase
    const { bip32RootKey } = this.keyringService.calcBip32RootKeyFromSeed("SPN", this.passphrase, "p4ssphr4se")
    this.account = this.keyringService.calcForDerivationPathForCoin("SPN", 0, 0, bip32RootKey)
    console.log("account0:", this.account)
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

  ionViewDidLeave(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.writtenDown = false
    this.terms = false
  }
}
