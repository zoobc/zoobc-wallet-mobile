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

    try {
      const authData = await this.authService.login(pin);

      this.accountSrv.masterSeed = authData.masterSeed;

      this.navCtrl.navigateRoot("main/dashboard");

      setTimeout(() => {
        observer.next("");
      }, 500);
    } catch (err) {
      setTimeout(() => {
        observer.next("");
        this.failedToast(err);
      }, 500);
    }
  }

  createAccount() {
    this.navCtrl.navigateForward("initial");
  }

  async failedToast(err) {
    let message = "";
    if (err === "not match") {
      message = "Pin is not match!";
    }

    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
