import { Component, OnInit } from "@angular/core";
import { ToastController, NavController } from "@ionic/angular";
import { CreateAccountService } from "../../Services/create-account.service";
import { SetupPinService } from "src/app/Services/setup-pin.service";
import { AuthService } from "src/app/Services/auth-service";

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
    private setupPinSrv: SetupPinService
  ) {}

  ngOnInit() {
    this.setupPinSrv.setupPinSubject.subscribe(data => {
      const { status, pin } = data;
      if (status == "success") {
        this.setPin(pin);
      }
    });
  }

  async setPin(pin: string) {
    this.createAccSrv.setPin(pin);
    await this.createAccSrv.createAccount();
    const loginStatus = await this.authSrv.login(pin);
    if (loginStatus) {
      this.navCtrl.navigateRoot("main/dashboard");
    }
  }

  openExistingWallet() {
    const lengthPassphrase = this.passphrase.split(" ").length;
    if (this.passphrase && lengthPassphrase === 12) {
      this.createAccSrv.setPassphrase(this.passphrase);
      this.navCtrl.navigateForward("setup-pin");
    } else {
      this.presentErrorToast();
    }
  }

  async presentErrorToast() {
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
