import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { Storage } from "@ionic/storage";
import sha512 from "crypto-js/sha512";
import { NavController } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class AuthService implements CanActivate {
  private isUserLoggenIn = false;
  constructor(private navCtrl: NavController, private storage: Storage) {}

  async canActivate(route: ActivatedRouteSnapshot) {
    const isPinSetup = await this.storage.get("pin");

    if (isPinSetup && !this.isUserLoggenIn) {
      this.navCtrl.navigateForward("login");
      return false;
    } else if (!this.isUserLoggenIn) {
      this.navCtrl.navigateForward("initial");
      return false;
    }
    return true;
  }

  async login(pin) {
    const encryptedPin = sha512(pin.toString()).toString();
    const storedPin = await this.storage.get("pin");

    if (encryptedPin === storedPin) {
      this.isUserLoggenIn = true;
      return true;
    } else {
      return false;
    }
  }

  async logout() {
    this.isUserLoggenIn = false;
  }
}
