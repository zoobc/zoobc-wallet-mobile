import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, ToastController } from '@ionic/angular';
import { ModalCreateAccountComponent } from './modal-create-account/modal-create-account.component';
import { Storage } from '@ionic/storage';
import { AccountService } from 'src/app/services/account.service';
import { ActiveAccountService } from '../services/active-account.service';

@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  styleUrls: ['./list-account.component.scss']
})
export class ListAccountComponent implements OnInit {
  constructor(
    private navtrl: NavController,
    public modalController: ModalController,
    private storage: Storage,
    private accountService: AccountService,
    private toastController: ToastController,
    private activeAccountSrv: ActiveAccountService
  ) {}

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

  accountClicked(index) {
    const activeAccount = this.accountsRaw[index];

    this.storage.set('active_account', activeAccount).then(() => {
      this.activeAccountSrv.setActiveAccount(activeAccount);
      this.navtrl.pop();
    });
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
