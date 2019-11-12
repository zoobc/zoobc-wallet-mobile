import { Component, OnInit } from "@angular/core";
import { AlertController, NavController } from "@ionic/angular";

@Component({
  selector: "app-apps",
  templateUrl: "./apps.page.html",
  styleUrls: ["./apps.page.scss"]
})
export class AppsPage implements OnInit {
  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  openSellApp() {
    this.navCtrl.navigateForward("apps/sell");
  }

  async openOtherApp() {
    const alert = await this.alertCtrl.create({
      header: "Information",
      message: "Feature is not available yet!",
      buttons: ["OK"]
    });

    await alert.present();
  }
}
