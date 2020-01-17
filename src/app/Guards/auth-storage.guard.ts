import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { NavController } from "@ionic/angular";
import { AuthService } from "../Services/auth.service";

@Injectable({
  providedIn: "root"
})
export class AuthStorageGuard implements CanActivate {
  constructor(private navCtrl: NavController, private authSrv: AuthService) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (await this.authSrv.isAuthenticate()) {
      return true;
    } else {
      this.navCtrl.navigateForward("login");
      return false;
    }
  }
}
