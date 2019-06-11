import { Component, OnInit } from '@angular/core';
import { KeyringService } from '../core/keyring.service';
import { ToastController } from '@ionic/angular';
import { MnemonicsService } from '../core/mnemonics.service';

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


  constructor(
    private keyringService: KeyringService,
    private toastController: ToastController,
    private mnemonicsService: MnemonicsService
  ) { }

  ngOnInit() {
    this.checkSetupPin()
    this.generatePassphrase()
  }

  checkSetupPin() {
    if(this.writtenDown && this.terms) {
      this.setupPin = true
    }
  }

  generatePassphrase() {
    this.passphrase = this.keyringService.generateRandomPhrase().phrase
    const privateKey = this.mnemonicsService.mnemonic.toSeed(this.passphrase, null)

    console.log("privateKey", privateKey)
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
