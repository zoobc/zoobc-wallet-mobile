import { Component, OnInit } from "@angular/core";
import { ToastController, NavController } from "@ionic/angular";
import { CreateAccountService } from "../../Services/create-account.service";
import { SetupPinService } from "src/app/Services/setup-pin.service";
import { AuthService } from "src/app/Services/auth-service";
import { AccountService } from "src/app/Services/account.service";

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
    private setupPinSrv: SetupPinService
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
    this.createAccSrv.pin = pin;
    await this.createAccSrv.createAccount();

    const accountProps = await this.accountSrv.generateAccount(
      this.createAccSrv.passphrase
    );
    const account = await this.accountSrv.insert("Account 1", accountProps);
    this.accountSrv.setActiveAccount(account);

    const loginStatus = await this.authSrv.login(pin);
    if (loginStatus) {
      this.navCtrl.navigateRoot("main/dashboard");
    }
  }

  openExistingWallet() {
    const lengthPassphrase = this.passphrase.split(" ").length;
    if (this.passphrase && lengthPassphrase === 12) {
      this.createAccSrv.passphrase = this.passphrase;
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
