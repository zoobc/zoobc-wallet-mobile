import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { Account } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
import { UtilService } from 'src/app/Services/util.service';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.page.html',
  styleUrls: ['./receive.page.scss'],
})
export class ReceivePage implements OnInit {

  createdCode: any;
  amount = 0;
  account: Account;

  constructor(
    private menuController: MenuController,
    private socialSharing: SocialSharing,
    public platform: Platform,
    private accountService: AccountService,
    private utilService: UtilService
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
    this.utilService.copyToClipboard(this.account.address);
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
