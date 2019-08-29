import { Component, OnInit } from "@angular/core";
import { KeyringService } from "../../Services/keyring.service";
import { ToastController, NavController } from "@ionic/angular";
import { CreateAccountService } from "../../Services/create-account.service";
import { AuthService } from "src/app/Services/auth-service";
import { SetupPinService } from "src/app/Services/setup-pin.service";

@Component({
  selector: "app-generate-passphrase",
  templateUrl: "./generate-passphrase.page.html",
  styleUrls: ["./generate-passphrase.page.scss"]
})
export class GeneratePassphrasePage implements OnInit {
  writtenDown = false;
  terms = false;
  passphrase: string;

  constructor(
    private keyringService: KeyringService,
    private toastController: ToastController,
    private createAccSrv: CreateAccountService,
    private navCtrl: NavController,
    private authSrv: AuthService,
    private setupPinSrv: SetupPinService
  ) {}

  ngOnInit() {
    this.generatePassphrase();

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

  setupPin() {
    this.createAccSrv.setPassphrase(this.passphrase);
    this.navCtrl.navigateForward("setup-pin");
  }

  async generatePassphrase() {
    const passphrase = this.keyringService.generateRandomPhrase().phrase;
    this.passphrase = passphrase;
  }

  copyToClipboard() {
    const val = this.passphrase;

    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);

    this.presentToast("Passphrase copied to clipboard");
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  ionViewDidLeave(): void {
    this.writtenDown = false;
    this.terms = false;
  }
}
