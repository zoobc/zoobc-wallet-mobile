import { Component, ViewChild } from "@angular/core";
import { SidemenuComponent } from "src/components/sidemenu/sidemenu.component";
import { NavigationExtras, Router } from "@angular/router";
import { IonTabs, NavController, ToastController } from "@ionic/angular";
import { QrScannerService } from '../qr-scanner/qr-scanner.service';

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"]
})
export class TabsPage {

  private address = '';
  private navigationExtras: NavigationExtras;

  @ViewChild(SidemenuComponent) sidemenu: SidemenuComponent;

  @ViewChild("myTabs") tabRef: IonTabs;

  seeTabs = true;


  onTabChanged($event) {
    if ($event.tab === "dashboard") {
      this.seeTabs = false;
    } else {
      this.seeTabs = true;
    }
  }


  constructor(public navCtrl: NavController,
              private qrScannerSrv: QrScannerService,
              private router: Router, private toastController: ToastController) { }



  async failedToast(address: string) {
    const toast = await this.toastController.create({
      message: 'Address: ' + address,
      duration: 7000
    });
    toast.present();
  }

  async scanQrCode() {

    // this.router.navigateByUrl('/qr-scanner');
    // this.qrScannerSrv.listen().subscribe((address: string) => {
    //     this.address = address;
    //     this.failedToast(this.address);

    //     this.navigationExtras = {
    //       queryParams: {
    //         address: JSON.stringify(this.address)
    //       }
    //     };

    //     this.navCtrl.navigateForward(['/tabs/send'], this.navigationExtras).then();

    // });

 
    const navigationExtras: NavigationExtras = {
      queryParams: {
          from: JSON.stringify('tabscan')
      }
    };
    this.navCtrl.navigateForward(['/qr-scanner'], navigationExtras);
    
  }

}
