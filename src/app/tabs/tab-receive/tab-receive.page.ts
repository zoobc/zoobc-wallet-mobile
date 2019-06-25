import { Component, OnInit } from '@angular/core';
import * as qrcode from 'qrcode-generator';

import { MenuController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AccountService } from 'src/services/account.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-tab-receive',
  templateUrl: 'tab-receive.page.html',
  styleUrls: ['tab-receive.page.scss']
})

export class TabReceivePage {
  encodeData: string;
  qrCodeUrl: any;

  constructor(
    private clipboard: Clipboard,
    private toastController: ToastController,
    private menuController: MenuController,
    private storage: Storage,
    private accountService: AccountService
  ) { }

  openMenu() {
    this.menuController.open("mainMenu")
  }

  tapAddress() {
    this.clipboard.copy(this.encodeData);
    this.copySuccess();
  }

  async copySuccess() {
    const toast = await this.toastController.create({
      message: 'Your address copied to clipboard.',
      duration: 2000
    });

    toast.present();
  }

  createQR() {
    const qrCode = qrcode(8, 'L');
    qrCode.addData(this.encodeData);
    qrCode.make();
    this.qrCodeUrl = qrCode.createDataURL(4, 8);
  }

  async getAddress() {
    const activeAccount = await this.storage.get('active_account')
    this.encodeData = this.accountService.getAccountAddress(activeAccount)
    this.createQR();
  }

  ionViewDidEnter() {
    this.getAddress();
  }

  onInit() {

  }
}
