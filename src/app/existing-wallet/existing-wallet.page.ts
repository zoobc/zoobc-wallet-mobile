import { Component, OnInit } from "@angular/core";
import { MnemonicsService } from "../services/mnemonics.service";
import { ToastController, NavController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { CreateAccountService } from "../services/create-account.service";

@Component({
  selector: "app-existing-wallet",
  templateUrl: "./existing-wallet.page.html",
  styleUrls: ["./existing-wallet.page.scss"]
})
export class ExistingWalletPage implements OnInit {
  passphrase;
  constructor(
    private mnemonicServ: MnemonicsService,
    private toastController: ToastController,
    private router: Router,
    private storage: Storage,
    private navCtrl: NavController,
    private createAccSrv: CreateAccountService
  ) {}

  ngOnInit() {}

  openExistingWallet() {

    // const valid = this.mnemonicServ.validateMnemonic(
    //   this.passphraseField.value
    // );
    // const mnemonicNumLength = this.passphraseField.value.split(' ').length;
    // if (mnemonicNumLength != this.mnemonicWordLengtEnv) {
    //   this.passphraseField.setErrors({ lengthMnemonic: true });
    // }

    const lengthPassphrase = this.passphrase.split(" ").length;
    if (this.passphrase && lengthPassphrase === 12 || this.passphrase && lengthPassphrase === 24) {
      const privateKey = this.mnemonicServ.mnemonic.toSeed(this.passphrase);

      this.createAccSrv.setPassphrase(this.passphrase);

      // this.storage.set("private_key", privateKey);
      this.router.navigate(["/setup-pin"]);
    } else {
      this.errorToast();
    }
  }

  async errorToast() {
    const toast = await this.toastController.create({
      message: "Error",
      duration: 2000
    });
    toast.present();
  }

  goback() {
    this.navCtrl.pop();
  }
}
