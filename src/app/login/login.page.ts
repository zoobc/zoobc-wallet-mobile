import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/services/auth-service";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  private pin = "";
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async login(e: any) {
    const { observer, pin } = e;

    const isUserLoggedIn = await this.authService.login(pin);
    if (isUserLoggedIn) {
      this.router.navigate(["tabs"]);

      setTimeout(() => {
        observer.next(true);
      }, 500);
    } else {
      setTimeout(() => {
        observer.next(true);
        this.failedToast();
      }, 500);
    }
  }

  createAccount() {
    this.router.navigate(["initial"]);
  }

  async failedToast() {
    const toast = await this.toastController.create({
      message: "Unlock Failed",
      duration: 2000
    });
    toast.present();
  }
}
