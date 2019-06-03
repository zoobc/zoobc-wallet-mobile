import { Component, OnInit } from '@angular/core';
import * as qrcode from 'qrcode-generator';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page implements OnInit{
  encodeData: any;
  qrElement: any;

  constructor() {}

  createQR() {
    const qr = qrcode(8, 'L');
    qr.addData(this.encodeData);
    qr.make();
    this.qrElement = qr.createImgTag();
  }

  getAddress(){
    this.encodeData =  JSON.stringify('1Mz7153HMuxXTuR2R1t78mGSdzaAtNbBWX');
  }

  ngOnInit() {
    this.getAddress();
    this.createQR();
  }

}
