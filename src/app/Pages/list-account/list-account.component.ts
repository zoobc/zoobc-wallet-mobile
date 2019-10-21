import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, ToastController } from '@ionic/angular';
import { ModalCreateAccountComponent } from './modal-create-account/modal-create-account.component';
import { Storage } from '@ionic/storage';
import { AccountService } from 'src/app/Services/account.service';
import { ActiveAccountService } from 'src/app/Services/active-account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  styleUrls: ['./list-account.component.scss']
})
export class ListAccountComponent implements OnInit {

  private forWhat: string;

  constructor(
    private location: Location,
    private navtrl: NavController,
    private modalController: ModalController,
    private storage: Storage,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private toastController: ToastController,
    private activeAccountSrv: ActiveAccountService
  ) {

    this.route.queryParams.subscribe(params => {
      console.log('==== params received:', params);
 
      if (this.router.getCurrentNavigation().extras.state) {
        console.log('==== state received:', this.router.getCurrentNavigation().extras.state);
        this.forWhat = this.router.getCurrentNavigation().extras.state.forWhat;
        console.log(' ===  this.forwat:', this.forWhat);
      }
    });

  }

  accounts: any = [];
  accountsRaw = [];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.storage.get('accounts').then(data => {
      console.log('__data', data);

      this.accountsRaw = data;
      this.accounts = data.map((acc: { accountName: any; created: any; }) => {
        const { accountName, created } = acc;
        return {
          accountName,
          address: this.accountService.getAccountAddress(acc),
          created
        };
      });
    });
  }

  accountClicked(index: number) {
    const activeAccount = this.accountsRaw[index];
    console.log('======= active Account clicked 1: ', activeAccount);

    console.log('===== forwat accountClicked 2:', this.forWhat);

    if (this.forWhat === 'sender' || this.forWhat === 'account' ){
      this.activeAccountSrv.setForWhat(this.forWhat);
      this.storage.set('active_account', activeAccount).then(() => {
        this.activeAccountSrv.setActiveAccount(activeAccount);
        this.location.back();
      });

    } else if (this.forWhat === 'recipient') {
      this.activeAccountSrv.setForWhat(this.forWhat);
      const address = this.accountService.getAccountAddress(activeAccount);
      this.activeAccountSrv.setRecipient(address);
      this.location.back();
    }

  }

  copyAddress(index) {

    const account = this.accountsRaw[index];

    console.log('Copy address: ', account);

    const val = this.accountService.getAccountAddress(account);
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

  createNewAccount() {
    this.presentModal({accountName: '', address: ''}, 0, 'new');
  }

  editName(index: number) {
    const account = this.accountsRaw[index];
    console.log('==== edited address: ', account);
    this.presentModal(account, index, 'edit');
  }

  async presentModal(arg: any, idx: number, trxMode: string) {
    const modal = await this.modalController.create({
      component: ModalCreateAccountComponent,
      componentProps: {
        accountName: arg.accountName,
        address: arg.address,
        mode: trxMode,
        index: idx
      }
    });

    modal.onDidDismiss().then((returnVal: any) => {
      this.loadData();

      // if (returnVal.data.account) {
      //   const account = returnVal.data.account;

      //   this.accountsRaw.push(account);
      //   this.accounts.push({
      //     accountName: account.accountName,
      //     address: this.accountService.getAccountAddress(account)
      //   });
      // }

    });

    return await modal.present();
  }
}
