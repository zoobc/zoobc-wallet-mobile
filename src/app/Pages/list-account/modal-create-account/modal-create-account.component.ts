import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { AccountService } from "src/app/Services/account.service";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-modal-create-account",
  templateUrl: "./modal-create-account.component.html",
  styleUrls: ["./modal-create-account.component.scss"]
})
export class ModalCreateAccountComponent implements OnInit {
  formAccount: any;
  toast: any;

  constructor(
    private modalCtrl: ModalController,
    private storage: Storage,
    private accountSrv: AccountService,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController
  ) {
    this.formAccount = this.formBuilder.group({
      name: ["", Validators.required]
    });
  }

  ngOnInit() {}

  ionViewWillLeave() {
    if (this.toast) {
      this.toast.dismiss();
    }
  }

  closeModal() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  async save() {
    if (this.formAccount.dirty && this.formAccount.valid) {
      const passphrase = await this.storage.get("passphrase");
      const account = await this.accountSrv.generateAccount(passphrase);
      const dataAccount = await this.accountSrv.insert(
        this.formAccount.get("name").value,
        account
      );

      this.modalCtrl.dismiss({
        account: dataAccount
      });
    } else {
      this.toast = await this.toastCtrl.create({
        message: "Please complete the form!",
        duration: 3000
      });

      this.toast.present();
    }
  }
}
