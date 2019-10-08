import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { QrScannerService } from './qr-scanner.service';
import { ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss'],
})
export class QrScannerComponent implements OnInit {

  public from = '';

  txtAddress = '';

  constructor(private qrScanner: QRScanner, private navCtrl: NavController,
              private qrScannerSrv: QrScannerService, private activeRoute: ActivatedRoute, private toastController: ToastController) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.from = JSON.parse(params.from);
      console.log('== From: ', this.from);
    });
  }

  ionViewWillLeave() {
    this.qrScannerSrv.setResult(this.txtAddress);
    try {
      this.qrScanner.hide();
      this.qrScanner.destroy();
    } catch (e) {
    }

    if (this.from && this.from === 'tabscan') {
      // if scanner trigered from tabscan, after scan redirect to scan page.
      const navigationExtras: NavigationExtras = {
        queryParams: {
          address: JSON.stringify(this.txtAddress)
        }
      };
      this.navCtrl.navigateForward(['/sendcoin'], navigationExtras);
    }

  }

  async ionViewDidEnter() {

    this.activeRoute.queryParams.subscribe(params => {
      this.from = JSON.parse(params.from);
      console.log('== From: ', this.from);
    });

    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // start scanning
          const scanSub = this.qrScanner.scan().subscribe(async (text: string) => {
            this.txtAddress =  text;
            scanSub.unsubscribe();
            this.navCtrl.pop();
          });
          this.qrScanner.show();
        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
          this.qrScanner.openSettings();
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => {
        alert(e);
        console.log('Error is', e);
      });

  }

}
