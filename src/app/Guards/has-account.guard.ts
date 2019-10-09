import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { NavController } from "@ionic/angular";
import { AuthService } from "../Services/auth.service";

@Injectable({
  providedIn: "root"
})
export class HasAccountGuard implements CanActivate {
  constructor(private navCtrl: NavController, private authSrv: AuthService) {}
  async canActivate() {
    if (await this.authSrv.hasAccount()) {
      return true;
    } else {
      this.navCtrl.navigateForward("initial");
      return false;
    }
  }
}
