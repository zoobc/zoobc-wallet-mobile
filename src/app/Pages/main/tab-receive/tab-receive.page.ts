import { Component, OnInit } from "@angular/core";
import * as qrcode from "qrcode-generator";

import { MenuController, ToastController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { AccountService } from "src/app/Services/account.service";
import { Clipboard } from "@ionic-native/clipboard/ngx";
import { ActiveAccountService } from "src/app/Services/active-account.service";

@Component({
  selector: "app-tab-receive",
  templateUrl: "tab-receive.page.html",
  styleUrls: ["tab-receive.page.scss"]
})
export class TabReceivePage implements OnInit {
  encodeData: string;
  qrCodeUrl: any;

  account = {
    name: "",
    address: "",
    qrCode: ""
  };

  constructor(
    private clipboard: Clipboard,
    private toastController: ToastController,
    private menuController: MenuController,
    private storage: Storage,
    private accountSrv: AccountService,
    private activeAccountSrv: ActiveAccountService
  ) {
    this.activeAccountSrv.accountSubject.subscribe({
      next: account => {
        this.account.name = account.name;
        this.account.address = account.address;

        this.account.qrCode = this.createQR(account.address);
      }
    });
  }

  async ngOnInit() {
    const activeAccount = await this.accountSrv.getActiveAccount();

    this.account.name = activeAccount.name;
    this.account.address = activeAccount.address;
    this.account.qrCode = this.createQR(activeAccount.address);
  }

  openMenu() {
    this.menuController.open("mainMenu");
  }

  tapAddress() {
    const val = this.account.address;

    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);

    this.copySuccess();
  }

  async copySuccess() {
    const toast = await this.toastController.create({
      message: "Your address copied to clipboard.",
      duration: 2000
    });

    toast.present();
  }

  createQR(value: string) {
    const qrCode = qrcode(8, "L");
    qrCode.addData(value);
    qrCode.make();
    return qrCode.createDataURL(4, 8);
  }
}
