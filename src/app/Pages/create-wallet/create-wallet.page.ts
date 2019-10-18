import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-create-wallet",
  templateUrl: "./create-wallet.page.html",
  styleUrls: ["./create-wallet.page.scss"]
})
export class CreateWalletPage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  goback() {
    this.navCtrl.pop();
  }
}
