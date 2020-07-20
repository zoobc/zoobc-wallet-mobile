import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/Services/auth-service";
import { Router } from "@angular/router";
import { ThemeService } from "src/app/Services/theme.service";
import { DEFAULT_THEME } from "src/environments/variable.const";
import { AccountService } from "src/app/Services/account.service";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  public isLoginValid = true;
  theme = DEFAULT_THEME;
  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router,
    private themeSrv: ThemeService,
    private navCtrl: NavController
  ) {
    // if theme changed
    this.themeSrv.themeSubject.subscribe(() => {
      this.theme = this.themeSrv.theme;
    });
  }

  ionViewDidEnter() {
    this.theme = this.themeSrv.theme;
    if (!this.theme || this.theme === "" || this.theme === undefined) {
      this.theme = DEFAULT_THEME;
    }
    console.log("=== ionViewDidEnter current theme: ", this.theme);
  }

  async ngOnInit() {
    this.theme = this.themeSrv.theme;
    if (!this.theme || this.theme === "" || this.theme === undefined) {
      this.theme = DEFAULT_THEME;
    }

    console.log("=== current theme: ", this.theme);

    const acc = await this.accountService.getCurrAccount();
    if (acc === null) {
      this.router.navigate(["initial"]);
      return;
    }

    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      this.navCtrl.navigateRoot("/dashboard");
    }
  }

  async login(e: any) {
    const { pin } = e;
    this.isLoginValid = true;
    const isUserLoggedIn = await this.authService.login(pin);
    if (isUserLoggedIn) {
      this.navCtrl.navigateRoot("/dashboard");
    } else {
      this.isLoginValid = false;
      setTimeout(() => {
        this.isLoginValid = true;
      }, 1500);
    }
  }
}
