import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { AccountService } from "src/app/Services/account.service";
import { AuthService } from "src/app/Services/auth.service";

@Component({
  selector: "app-modal-pin",
  templateUrl: "./modal-pin.component.html",
  styleUrls: ["./modal-pin.component.scss"]
})
export class ModalPinComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private accountSrv: AccountService,
    private authSrv: AuthService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async confirm(e) {
    const { observer, pin } = e;
    try {
      const authData = await this.authSrv.getAuthData(pin);

      this.accountSrv.masterSeed = authData.masterSeed;

      setTimeout(() => {
        observer.next("");

        this.modalCtrl.dismiss({
          confirm: true,
          authData: authData
        });
      }, 500);
    } catch (err) {
      setTimeout(() => {
        observer.next("");
        this.failedToast(err);
      }, 500);
    }
  }

  async failedToast(err) {
    let message = "";
    if (err === "not match") {
      message = "Pin is not match. Please try again!";
    }

    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
