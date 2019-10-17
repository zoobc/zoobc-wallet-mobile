import { Component, ViewChild, NgZone } from "@angular/core";
import { IonTabs, NavController } from "@ionic/angular";
import { QrScannerService } from "src/app/Services/qr-scanner.service";
import { NavigationOptions } from "@ionic/angular/dist/providers/nav-controller";

@Component({
  selector: "app-main",
  templateUrl: "main.page.html",
  styleUrls: ["main.page.scss"]
})
export class MainPage {
  @ViewChild("myTabs") tabRef: IonTabs;

  seeTabs = true;

  onTabChanged($event) {
    if ($event.tab === "dashboard") {
      this.seeTabs = false;
    } else {
      this.seeTabs = true;
    }
  }

  constructor(
    private navCtrl: NavController,
    private qrScannerSrv: QrScannerService,
    private ngZone: NgZone
  ) {}

  async scanQrCode() {
    this.navCtrl.navigateForward("qr-scanner").then(data => {
      if (data) {
        const _qrScanner = this.qrScannerSrv
          .listen()
          .subscribe((str: string) => {
            setTimeout(() => {
              const params: NavigationOptions = {
                queryParams: {
                  recipient: str
                }
              };

              this.ngZone.run(() => {
                this.navCtrl.navigateForward("main/send", params);
              });
            });

            _qrScanner.unsubscribe();
          });
      }
    });
  }
}
