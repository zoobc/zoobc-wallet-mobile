import { Component, OnInit } from "@angular/core";
import { AddressBookService } from "src/app/Services/address-book.service";
import { ToastController, NavController } from "@ionic/angular";
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup
} from "@angular/forms";
import { QrScannerService } from "src/app/Services/qr-scanner.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-address-book-form",
  templateUrl: "./address-book-form.component.html",
  styleUrls: ["./address-book-form.component.scss"]
})
export class AddressBookFormComponent implements OnInit {
  addressForm: FormGroup;

  title: string = "";

  constructor(
    private addressBookSrv: AddressBookService,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private qrScannerSrv: QrScannerService,
    private route: ActivatedRoute
  ) {
    this.addressForm = this.formBuilder.group({
      name: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required])
    });
  }

  ngOnInit() {
    this.route.data.subscribe(v => (this.title = v.title));
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async onSubmit(value) {
    if (!this.addressForm.valid) {
      this.presentToast("Please complete all the fields");
    } else {
      await this.addressBookSrv.save(value.name, value.address);

      this.navCtrl.pop();
    }
  }

  scanAddress() {
    this.navCtrl.navigateForward("qr-scanner");

    this.qrScannerSrv.listen().subscribe((str: string) => {
      this.addressForm.patchValue({
        address: str
      });
    });
  }

  close() {
    this.navCtrl.pop();
  }
}
