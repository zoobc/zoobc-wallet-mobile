import { Component, OnInit } from "@angular/core";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner/ngx";
import { NavController } from "@ionic/angular";
import { QrScannerService } from "src/app/Services/qr-scanner.service";

@Component({
  selector: "app-qr-scanner",
  templateUrl: "./qr-scanner.page.html",
  styleUrls: ["./qr-scanner.page.scss"]
})
export class QrScannerPage implements OnInit {
  constructor(
    private qrScanner: QRScanner,
    private navCtrl: NavController,
    private qrScannerSrv: QrScannerService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // start scanning
          const scanSub = this.qrScanner.scan().subscribe((text: string) => {
            this.qrScanner.hide().then();
            scanSub.unsubscribe();
            this.qrScannerSrv.setResult(text);
            this.navCtrl.pop();
          });

          this.qrScanner.show().then();
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
        console.log("Error is", e);
      });
  }
}
