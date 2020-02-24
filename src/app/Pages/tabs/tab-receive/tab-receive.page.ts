import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform } from '@ionic/angular';
import { MenuController, ToastController } from '@ionic/angular';
import { Account } from 'src/app/Services/auth-service';
import { AccountService } from 'src/app/Services/account.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
@Component({
  selector: 'app-tab-receive',
  templateUrl: 'tab-receive.page.html',
  styleUrls: ['tab-receive.page.scss']
})
export class TabReceivePage implements OnInit {

  createdCode: any;
  amount = 0;
  account: Account;

  constructor(
    private accountService: AccountService,
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

  async loadData() {
    this.account = await this.accountService.getCurrAccount();
    console.log('=== account: ', this.account);
    this.createQR(this.account.address, this.amount);
  }

  ngOnInit(): void {
    this.loadData();
  }

  changeBarcode() {
    this.createQR(this.account.address, this.amount);
  }

  copyToClipboard() {
    this.accountService.copyToClipboard(this.account.address);
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

  createQR(addrs: string, amnt: number) {
    const qrCode = { address: addrs, amount: amnt };
    this.createdCode = JSON.stringify(qrCode);
  }

}
