import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform } from '@ionic/angular';
import { MenuController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AccountService } from 'src/app/Services/account.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ActiveAccountService } from 'src/app/Services/active-account.service';
import { makeShortAddress } from 'src/app/Helpers/converters';

@Component({
  selector: 'app-tab-receive',
  templateUrl: 'tab-receive.page.html',
  styleUrls: ['tab-receive.page.scss']
})
export class TabReceivePage implements OnInit{

  
  createdCode: string;
  encodeData: string;
  qrCodeUrl: any;
  amount = 0;
  address = '';

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
        this.address = this.accountService.getAccountAddress(v);
        this.account.shortadress = makeShortAddress(this.address);
        this.account.accountName = v.accountName;
        this.account.address = this.address;
        this.createQR(this.address, this.amount);
      }
    });
  }

  openMenu() {
    this.menuController.open('mainMenu');
  }

  ngOnInit(): void {
    console.log("==== wOn initt  =====");
    this.getActiveAccount();

  }

  changeBarcode(){
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
      message: 'Your address copied to clipboard.',
      duration: 2000
    });

    toast.present();
  }

  createQR(addrs: string, amnt: number) {
    const qrCode = { address: addrs, amount: amnt };
    this.createdCode = JSON.stringify(qrCode);
  }

  async getActiveAccount() {
    const activeAccount = await this.storage.get('active_account');
    this.address = this.accountService.getAccountAddress(activeAccount);
    this.account.shortadress = makeShortAddress(this.address);
    this.account.accountName = activeAccount.accountName;
    this.account.address = this.address;
    this.createQR(this.address, this.amount);
  }

  async ionViewDidEnter() {
   console.log("==== will enter ====="); 
  }

}
