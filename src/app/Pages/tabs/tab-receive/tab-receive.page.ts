import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform } from '@ionic/angular';
import { MenuController, ToastController } from '@ionic/angular';
import { AccountInf } from 'src/app/Services/auth-service';
import { AccountService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-tab-receive',
  templateUrl: 'tab-receive.page.html',
  styleUrls: ['tab-receive.page.scss']
})
export class TabReceivePage implements OnInit {

  createdCode: string;
  amount = 0;
  account: AccountInf;

  constructor(
    private accountService: AccountService,
    private toastController: ToastController,
    private menuController: MenuController,
    private socialSharing: SocialSharing,
    public platform: Platform
  ) {
    this.accountService.accountSubject.subscribe(() => {
      this.loadData();
    });
  }

  openMenu() {
    this.menuController.open('mainMenu');
  }

  loadData() {
    this.account = this.accountService.getCurrAccount();
    this.createQR(this.account.address, this.amount);
  }

  ngOnInit(): void {
    this.loadData();
  }

  changeBarcode() {
    this.createQR(this.account.address, this.amount);
  }

  // Share Options
  async openSharing() {
    this.platform.ready().then(async () => {
      await this.socialSharing.share(this.account.address).then(() => {
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  copyToClipboard() {
    const val = this.account.address;
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

}
