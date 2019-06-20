import { Component, OnInit } from '@angular/core';
import * as qrcode from 'qrcode-generator';
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-tab-receive',
  templateUrl: 'tab-receive.page.html',
  styleUrls: ['tab-receive.page.scss']
})


export class TabReceivePage implements OnInit {
  encodeData: string;
  qrElement: any;

  constructor(private menuController: MenuController) { }

  openMenu() {
    this.menuController.open("mainMenu")
  }

  createQR() {
    const qr = qrcode(8, 'L');
    qr.addData(this.encodeData);
    qr.make();
    this.qrElement = qr.createImgTag();
  }

  getAddress() {
    this.encodeData = '1Mz7153HMuxXTuR2R1t78mGSdzaAtNbBWX';
  }

  ngOnInit() {
    this.getAddress();
    this.createQR();
  }

}
