import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { QrScannerService } from './qr-scanner.service';
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
        // alert("Barcode data " + JSON.stringify(barcodeData));
        if (!barcodeData.cancelled) {
          this.scannedData = barcodeData;
          this.jsonData = barcodeData.text;
          this.isScanned = true;
        }
        this.navCtrl.pop();
      })
      .catch(err => {
        // console.log('Error', err);
      });
  }

  ionViewWillLeave() {
    this.qrScannerSrv.setResult(this.jsonData);

    if (this.isScanned && this.from && this.from === 'tabscan') {
      // if scanner trigered from tabscan, after scan redirect to scan page.
      const navigationExtras: NavigationExtras = {
        queryParams: {
          jsonData: this.jsonData
        }
      };
      this.navCtrl.navigateForward(['/sendcoin'], navigationExtras);
    }

    this.from = '';
    this.isScanned = false;
    this.jsonData = '';

  }

  openScanner() {
    this.from = '';
    this.isScanned = false;
    this.jsonData = '';

    this.activeRoute.queryParams.subscribe(params => {
      this.from = JSON.parse(params.from);
      // console.log('== From: ', this.from);
    });

    this.scanCode();
  }

  async ionViewDidEnter() {
    // this.openScanner();

    // this.qrScanner.prepare()
    //   .then((status: QRScannerStatus) => {
    //     if (status.authorized) {
    //       // start scanning
    //       const scanSub = this.qrScanner.scan().subscribe(async (text: string) => {
    //         this.txtAddress = text;
    //         scanSub.unsubscribe();
    //         this.isScanned = true;
    //         this.navCtrl.pop();
    //       });
    //       this.qrScanner.show();
    //     } else if (status.denied) {
    //       // camera permission was permanently denied
    //       // you must use QRScanner.openSettings() method to guide the user to the settings page
    //       // then they can grant the permission from there
    //       this.qrScanner.openSettings();
    //     } else {
    //       this.isScanned = false;
    //       // permission was denied, but not permanently. You can ask for permission again at a later time.
    //     }
    //   })
    //   .catch((e: any) => {
    //     alert(e);
    //     this.isScanned = false;
    //     // console.log('Error is', e);
    //   });

  }

}
