import { Component, OnInit } from '@angular/core';
import * as qrcode from 'qrcode-generator';
import { MenuController, ToastController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-tab-receive',
  templateUrl: 'tab-receive.page.html',
  styleUrls: ['tab-receive.page.scss']
})

export class TabReceivePage implements OnInit {
  encodeData: string;
  qrCodeUrl: any;

  constructor(
    private clipboard: Clipboard,
    private menuController: MenuController,
    private toastController: ToastController) { }

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

  getAddress() {
    this.encodeData = '1Mz7153HMuxXTuR2R1t78mGSdzaAtNbBWX';
  }

  ngOnInit() {
    this.getAddress();
    this.createQR();
  }

}
