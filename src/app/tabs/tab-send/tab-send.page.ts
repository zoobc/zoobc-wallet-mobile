import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, NavController, MenuController } from '@ionic/angular';
import { RestapiService } from '../../../services/restapi.service';
import * as  SHA256 from 'crypto-js/sha256';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AboutPage } from '../../about/about.page';
import { Router } from '@angular/router';
import { QrScannerService } from '../../qr-scanner/qr-scanner.service';

@Component({
  selector: 'app-tab-send',
  templateUrl: 'tab-send.page.html',
  styleUrls: ['tab-send.page.scss']
})
export class TabSendPage implements OnInit {
  sender: any;
  recipient: any;
  amount: any;
  fee: any;
  result: any;
  dataui: any;
  status: any;

  public rootPage: any = AboutPage

  constructor(private loadingController: LoadingController,
    private apiservice: RestapiService, private qrScanner: QRScanner,
    private toastCtrl: ToastController,
    public navCtrl: NavController,
    private router: Router,
    private menuController: MenuController,
    private qrScannerSrv: QrScannerService) {
    this.sender = this.getAddress();
    //this.resetForm();
  }

  ngOnInit() {

  }

  resetForm() {
    this.recipient = this.getFakeRecipient();
    this.amount = Math.floor((Math.random() * 10000) + 1);
    this.fee = Math.floor((Math.random() * 10) + 1);
  }

  getFakeRecipient() {
    const recipient = Math.floor((Math.random() * 1000000) + 1) + '-Recipient';
    return SHA256(JSON.stringify(recipient)).toString();
  }

  async sendMoney() {
    this.status = '... processing ...';
    this.recipient = this.getFakeRecipient();

    const loading = await this.loadingController.create({
      message: 'Loading'
    });
    await loading.present();
    this.apiservice.sendMoney(this.sender, this.recipient, this.amount, this.fee)
      .subscribe(res => {
        console.log(res);
        this.result = res[0];
        this.dataui = this.result['data'];
        this.status = '... success ...';
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
        this.status = '... error ...';
      });

    this.resetForm();

  }

  getAddress() {
    const sender = Math.floor((Math.random() * 1000000) + 1) + '-Sender';
    return SHA256(JSON.stringify(sender)).toString();
  }

  openMenu() {
    this.menuController.open("mainMenu")
  }

  scanQrCode() {
    this.router.navigateByUrl('/qr-scanner')

    this.qrScannerSrv.listen().subscribe((str: string) => {
      this.recipient = str;
    })
  }
}
