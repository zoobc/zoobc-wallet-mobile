import { Component, OnInit } from '@angular/core';
import { MnemonicsService } from '../core/mnemonics.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-existing-wallet',
  templateUrl: './existing-wallet.page.html',
  styleUrls: ['./existing-wallet.page.scss'],
})
export class ExistingWalletPage implements OnInit {
  private passphrase
  constructor(
    private mnemonicService: MnemonicsService,
    private toastController: ToastController,
    private router: Router,
    private storage: Storage
  ) { }

  ngOnInit() {
  }

  openExistingWallet() {
    const lengthPassphrase = this.passphrase.split(" ").length
    if(this.passphrase && lengthPassphrase === 12){
      const privateKey = this.mnemonicService.mnemonic.toSeed(this.passphrase)
      this.storage.set('private_key', privateKey)
      this.router.navigate(['/setup-pin'])
    } else {
      this.errorToast();
    }
  }

  async errorToast() {
    const toast = await this.toastController.create({
      message: 'Passphrase copied to clipboard',
      duration: 2000
    });
    toast.present();
  }

}
