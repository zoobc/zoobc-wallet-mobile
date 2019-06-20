import { Component, OnInit } from '@angular/core';
import * as qrcode from 'qrcode-generator';
import { Storage } from '@ionic/storage';
import { ObservableService } from 'src/services/observable.service';
import { ACTIVE_ACCOUNT } from 'src/environments/variable.const';
import { AccountService } from 'src/services/account.service';
import { byteArrayToHex } from 'src/helpers/converters';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page implements OnInit{
  encodeData: any;
  qrElement: any;
  private activeAccount

  constructor(
    private storage: Storage,
    private Obs: ObservableService,
    private accountService: AccountService
  ) {}

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
    const a = this.Obs.Watch(ACTIVE_ACCOUNT).subscribe(e => {
      console.log("subscription on")
      this.activeAccount = e
    })
    console.log("a", a)
    this.getAddress();
  }

  ionViewWillEnter() {
    // this.getAddress()
    const a = this.Obs.GetAll()
    console.log("getAll", a)
  }

}
