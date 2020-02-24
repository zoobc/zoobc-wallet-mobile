import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform } from '@ionic/angular';
import { MenuController, ToastController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ActiveAccountService } from 'src/app/Services/active-account.service';
import { SavedAccount, AuthService } from 'src/app/Services/auth-service';

@Component({
  selector: 'app-tab-receive',
  templateUrl: 'tab-receive.page.html',
  styleUrls: ['tab-receive.page.scss']
})
export class TabReceivePage implements OnInit {

  createdCode: string;
  public amount = 0;
  public currAcc: SavedAccount;

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private menuController: MenuController,
    private activeAccountSrv: ActiveAccountService,
    private socialSharing: SocialSharing,
    public platform: Platform
  ) {
    this.activeAccountSrv.accountSubject.subscribe({
      next: v => {
        this.loadData();
      }
    });
  }

  openMenu() {
    this.menuController.open('mainMenu');
  }

  loadData() {
    this.currAcc = this.authService.getCurrAccount();
    this.createQR(this.currAcc.address, this.amount);
  }

  ngOnInit(): void {
    console.log('==== wOn initt  =====');
    this.loadData();

  }

  changeBarcode() {
    this.createQR(this.currAcc.address, this.amount);
  }

  // Share Options
  async openSharing() {
    this.platform.ready().then(async () => {
      await this.socialSharing.share(this.currAcc.address).then(() => {
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  copyToClipboard() {
    const val = this.currAcc.address;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.copySuccess();
  }

  async copySuccess() {
    const toast = await this.toastController.create({
      message: 'Copied to clipboard.',
      duration: 2000
    });

    toast.present();
  }

  createQR(addrs: string, amnt: number) {
    const qrCode = { address: addrs, amount: amnt };
    this.createdCode = JSON.stringify(qrCode);
  }

  async ionViewDidEnter() {
   console.log('==== will enter =====');
  }

}
