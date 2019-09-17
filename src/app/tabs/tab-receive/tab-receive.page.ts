import { Component, OnInit } from '@angular/core';
import * as qrcode from 'qrcode-generator';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform } from '@ionic/angular';
import { MenuController, ToastController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AccountService } from 'src/services/account.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ActiveAccountService } from 'src/app/services/active-account.service';

@Component({
  selector: 'app-tab-receive',
  templateUrl: 'tab-receive.page.html',
  styleUrls: ['tab-receive.page.scss']
})
export class TabReceivePage {
  encodeData: string;
  qrCodeUrl: any;
  account = {
    accountName: '',
    address: '',
    qrCode: '',
    shortadress: ''
  };

  constructor(
    private clipboard: Clipboard,
    private toastController: ToastController,
    private menuController: MenuController,
    private storage: Storage,
    private accountService: AccountService,
    private activeAccountSrv: ActiveAccountService,
    private socialSharing: SocialSharing,
    public platform: Platform
  ) {
    this.activeAccountSrv.accountSubject.subscribe({
      next: v => {
        const address = this.accountService.getAccountAddress(v);
        this.account.shortadress = this.shortAddress(address);
        this.account.accountName = v.accountName;
        this.account.address = address;
        this.account.qrCode = this.createQR(address);
      }
    });
  }

  openMenu() {
    this.menuController.open('mainMenu');
  }


  // Share Options
  async openSharing() {
    this.platform.ready().then(async () => {
      await this.socialSharing.share('My ZooBC address: '  +  this.account.address).then(() => {
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  tapAddress() {
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
      message: 'Your address copied to clipboard.',
      duration: 2000
    });

    toast.present();
  }

  shortAddress(addrs: string) {
    return addrs.substring(0, 10).concat('...').concat(addrs.substring(addrs.length - 10, addrs.length));
  }


  createQR(value: string) {
    const qrCode = qrcode(8, 'L');
    qrCode.addData(value);
    qrCode.make();
    return qrCode.createDataURL(4, 8);
  }

  async getActiveAccount() {
    const activeAccount = await this.storage.get('active_account');
    const address = this.accountService.getAccountAddress(activeAccount);
    this.account.shortadress = this.shortAddress(address);
    this.account.accountName = activeAccount.accountName;
    this.account.address = address;
    this.account.qrCode = this.createQR(address);
  }

  async ionViewDidEnter() {
    this.getActiveAccount();
  }

  onInit() { }
}
