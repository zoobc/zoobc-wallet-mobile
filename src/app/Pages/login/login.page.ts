import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/Services/auth-service";
import { ToastController, NavController } from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async login(e: any) {
    const { observer, pin } = e;

    const isUserLoggedIn = await this.authService.login(pin);
    if (isUserLoggedIn) {
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
