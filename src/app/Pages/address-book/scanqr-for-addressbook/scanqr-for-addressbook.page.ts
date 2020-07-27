import { Component, OnInit } from '@angular/core';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { QrScannerService } from 'src/app/Services/qr-scanner.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-scanqr-for-addressbook',
  templateUrl: './scanqr-for-addressbook.page.html',
  styleUrls: ['./scanqr-for-addressbook.page.scss'],
})
export class ScanqrForAddressbookPage implements OnInit {

  isScanned: boolean;
  jsonData = '';

  encodeData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;

  constructor(
    private location: Location,
    private barcodeScanner: BarcodeScanner,
    private qrScannerSrv: QrScannerService) {
    this.encodeData = '';
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
          // alert('Barcode data ' + JSON.stringify(barcodeData));
          this.scannedData = barcodeData;
          this.jsonData = barcodeData.text;
          this.isScanned = true;
          this.qrScannerSrv.setResult(this.jsonData);
        }
        this.location.back();
      })
      .catch(err => {
        console.log(err);
      });
  }

  ionViewWillLeave() {
    this.isScanned = false;
    this.jsonData = '';
  }

  openScanner() {
    this.isScanned = false;
    this.jsonData = '';
    this.scanCode();
  }

}
