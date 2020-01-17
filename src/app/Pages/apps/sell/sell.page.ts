import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, FormBuilder } from "@angular/forms";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-sell",
  templateUrl: "./sell.page.html",
  styleUrls: ["./sell.page.scss"]
})
export class AppSellPage implements OnInit {
  sellForm;

  constructor(
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.sellForm = this.formBuilder.group({
      sender: new FormControl("", Validators.compose([Validators.required]))
    });
  }

  async onSubmit() {
    const alert = await this.alertCtrl.create({
      header: "Information",
      message: "Feature is not available yet!",
      buttons: ["OK"]
    });

    await alert.present();
  }
}
