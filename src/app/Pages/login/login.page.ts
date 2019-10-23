import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
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
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  errorPin = "";

  loading = false;

  async login(e: any) {
    const { observer, pin } = e;

    this.loading = true;

    try {
      const authData = await this.authService.login(pin);

      this.accountSrv.masterSeed = authData.masterSeed;

      this.navCtrl.navigateRoot("main/dashboard");

      setTimeout(() => {
        this.loading = false;

        observer.next("");
      }, 500);
    } catch (err) {
      setTimeout(() => {
        this.loading = false;

        observer.next("");

        if (err === "not match") {
          this.errorPin = "Pin is not match!";
        }
      }, 500);
    }
  }

  onPinTouched() {
    this.errorPin = "";
  }

  createAccount() {
    this.navCtrl.navigateForward("initial");
  }
}
