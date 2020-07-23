import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { QrScannerService } from 'src/app/Services/qr-scanner.service';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss'],
})
export class QrScannerComponent implements OnInit {

  public from = '';
  isScanned: boolean;
  jsonData = '';

  encodeData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private navCtrl: NavController,
    private qrScannerSrv: QrScannerService, private activeRoute: ActivatedRoute, private toastController: ToastController) {
    this.encodeData = '';
    // Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  ngOnInit() {
    this.openScanner();
  }

  scanCode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        if (!barcodeData.cancelled) {
          this.scannedData = barcodeData;
          this.jsonData = barcodeData.text;
          this.isScanned = true;
        }
        this.navCtrl.pop();
      })
      .catch(err => {
        console.log(err);
      });
  }

  ionViewWillLeave() {
    this.qrScannerSrv.setResult(this.jsonData);
    if (this.isScanned && this.from && this.from === 'dashboard') {
      // if scanner trigered from tabscan, after scan redirect to scan page.
      const navigationExtras: NavigationExtras = {
        queryParams: {
          jsonData: this.jsonData,
          from: this.from
        }
      };
      this.navCtrl.navigateForward(['/sendcoin'], navigationExtras);
    }
    this.reset();
  }

  reset() {
    this.from = '';
    this.isScanned = false;
    this.jsonData = '';
  }

  openScanner() {
    this.reset();
    this.activeRoute.queryParams.subscribe(params => {
      if (params && params.from) {
        this.from = params.from;
      } else {
        this.from = '';
      }
    });

    this.scanCode();
  }

}
