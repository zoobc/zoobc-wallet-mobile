import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController, NavParams } from "@ionic/angular";
import { AccountService } from "src/app/Services/account.service";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-modal-form-account",
  templateUrl: "./modal-form-account.component.html",
  styleUrls: ["./modal-form-account.component.scss"]
})
export class ModalFormAccountComponent implements OnInit {
  formAccount: any;
  toast: any;
  title: string = "Create New Account";
  type: string = "add";
  item = null;

  constructor(
    private modalCtrl: ModalController,
    private accountSrv: AccountService,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private navParams: NavParams
  ) {
    this.formAccount = this.formBuilder.group({
      name: ["", Validators.required]
    });
  }

  ngOnInit() {
    if (this.navParams.get("title")) {
      this.title = this.navParams.get("title");
    }

    if (this.navParams.get("type")) {
      this.type = this.navParams.get("type");
    }

    if (
      this.navParams.get("type") &&
      this.navParams.get("type") == "edit" &&
      this.navParams.get("item")
    ) {
      this.item = this.navParams.get("item");
      const name = this.item.name;
      this.formAccount.patchValue({
        name
      });
    }
  }

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
    if (
      ((this.formAccount.dirty && this.type == "add") || this.type == "edit") &&
      this.formAccount.valid
    ) {
      let dataAccount = null;
      if (this.type == "edit") {
        dataAccount = await this.accountSrv.update(
          this.item.address,
          this.formAccount.get("name").value
        );
      } else {
        dataAccount = await this.accountSrv.insert(
          this.formAccount.get("name").value
        );
      }

      this.modalCtrl.dismiss({
        type: this.type,
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
