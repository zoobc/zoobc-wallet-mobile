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
export class AuthGuard implements CanActivate {
  constructor(private navCtrl: NavController, private authSrv: AuthService) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authSrv.isLoggedIn) {
      return true;
    } else {
      this.navCtrl.navigateForward("login");
      return false;
    }
  }
}
