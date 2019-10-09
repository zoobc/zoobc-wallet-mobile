import { Component, OnInit } from "@angular/core";
import { ToastController, NavController } from "@ionic/angular";
import { AccountService } from "src/app/Services/account.service";
import { AuthService } from "src/app/Services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  constructor(
    private accountSrv: AccountService,
    private authService: AuthService,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async login(e: any) {
    const { observer, pin } = e;

    const authData = await this.authService.login(pin);

    if (authData) {
      this.accountSrv.masterSeed = authData.masterSeed;

      this.navCtrl.navigateRoot("main/dashboard");

      setTimeout(() => {
        observer.next("");
      }, 500);
    } else {
      setTimeout(() => {
        observer.next("");
        this.failedToast();
      }, 500);
    }
  }

  createAccount() {
    this.navCtrl.navigateForward("initial");
  }

  async failedToast() {
    const toast = await this.toastController.create({
      message: "Unlock Failed",
      duration: 2000
    });
    toast.present();
  }
}
