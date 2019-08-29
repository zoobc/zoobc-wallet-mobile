import { Component, OnInit } from "@angular/core";
import * as qrcode from "qrcode-generator";

import { MenuController, ToastController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { AccountService } from "src/services/account.service";
import { Clipboard } from "@ionic-native/clipboard/ngx";
import { ActiveAccountService } from "src/app/Services/active-account.service";

@Component({
  selector: "app-tab-receive",
  templateUrl: "tab-receive.page.html",
  styleUrls: ["tab-receive.page.scss"]
})
export class TabReceivePage {
  encodeData: string;
  qrCodeUrl: any;

  account = {
    accountName: "",
    address: "",
    qrCode: ""
  };

  constructor(
    private clipboard: Clipboard,
    private toastController: ToastController,
    private menuController: MenuController,
    private storage: Storage,
    private accountService: AccountService,
    private activeAccountSrv: ActiveAccountService
  ) {
    this.activeAccountSrv.accountSubject.subscribe({
      next: v => {
        const address = this.accountService.getAccountAddress(v);

        this.account.accountName = v.accountName;
        this.account.address = address;
        this.account.qrCode = this.createQR(address);
      }
    });
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

  async getActiveAccount() {
    const activeAccount = await this.storage.get("active_account");
    const address = this.accountService.getAccountAddress(activeAccount);

    this.account.accountName = activeAccount.accountName;
    this.account.address = address;
    this.account.qrCode = this.createQR(address);
  }

  async ionViewDidEnter() {
    this.getActiveAccount();
  }

  onInit() {}
}
