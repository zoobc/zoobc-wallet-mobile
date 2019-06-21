import { Component, OnInit } from '@angular/core';
import * as qrcode from 'qrcode-generator';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AccountService } from 'src/services/account.service';


@Component({
  selector: 'app-tab-receive',
  templateUrl: 'tab-receive.page.html',
  styleUrls: ['tab-receive.page.scss']
})


export class TabReceivePage implements OnInit {
  encodeData: string;
  qrElement: any;

  constructor(
    private menuController: MenuController,
    private storage: Storage,
    private accountService: AccountService
  ) { }

  openMenu() {
    this.menuController.open("mainMenu")
  }

  createQR() {
    const qr = qrcode(8, 'L');
    qr.addData(this.encodeData);
    qr.make();
    this.qrElement = qr.createImgTag();
  }

  async getAddress(){
    const activeAccount = await this.storage.get('active_account')
    this.encodeData  = this.accountService.getAccountAddress(activeAccount)
    this.createQR();
  }

  ngOnInit() {
    this.getAddress();
  }
}
