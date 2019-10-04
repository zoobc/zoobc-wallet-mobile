import { Component, OnInit } from "@angular/core";
import { ToastController, NavController } from "@ionic/angular";
import { CreateAccountService } from "../../Services/create-account.service";
import { SetupPinService } from "src/app/Services/setup-pin.service";
import { AuthService } from "src/app/Services/auth-service";
import { AccountService } from "src/app/Services/account.service";
import * as bip39 from "bip39";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-existing-wallet",
  templateUrl: "./existing-wallet.page.html",
  styleUrls: ["./existing-wallet.page.scss"]
})
export class ExistingWalletPage implements OnInit {
  passphrase: string;

  constructor(
    private authSrv: AuthService,
    private toastController: ToastController,
    private navCtrl: NavController,
    private createAccSrv: CreateAccountService,
    private accountSrv: AccountService,
    private setupPinSrv: SetupPinService,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.setupPinSrv.setupPinSubject.subscribe(data => {
      const { status, pin } = data;
      if (status == "success") {
        this.submit(pin);
      }
    });
  }

  async submit(pin: string) {
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

  openExistingWallet() {
    if (!bip39.validateMnemonic(this.passphrase))
      this.presentErrorToast("Mnemonic is not valid!");
    else {
      this.createAccSrv.passphrase = this.passphrase;
      this.navCtrl.navigateForward("setup-pin");
    }
  }

  async presentErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  goback() {
    this.navCtrl.pop();
  }
}
