import { Component, OnInit } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { SetupPinService } from "src/app/Services/setup-pin.service";

@Component({
  selector: "app-setup-pin",
  templateUrl: "./setup-pin.page.html",
  styleUrls: ["./setup-pin.page.scss"]
})
export class SetupPinPage implements OnInit {
  private pin: string;

  private page: string = "enter-pin";

  constructor(
    private toastController: ToastController,
    private setupPinSrv: SetupPinService
  ) {}

  ngOnInit() {}

  async savePin(e: any) {
    const { observer, pin } = e;

    if (this.page == "confirm-pin") {
      if (this.pin == pin) {
        this.setupPinSrv.setStatus({
          status: "success",
          pin: pin
        });
      } else {
        observer.next("");
        this.presentToastError();
      }
    } else {
      this.pin = pin;
      this.page = "confirm-pin";
      observer.next("");
    }
  }

  async presentToastError() {
    const toast = await this.toastController.create({
      message: "Your Pin is not the same",
      duration: 2000
    });
    toast.present();
  }
}
