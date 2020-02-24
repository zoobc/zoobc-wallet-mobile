import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Currency } from 'src/app/Services/currency.service';
import { ActiveAccountService } from 'src/app/Services/active-account.service';
import { TransactionService } from 'src/app/Services/transaction.service';
import { SELECTED_NODE } from 'src/environments/variable.const';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
  public accounts = [];
  public activeCurrency = 'USD';
  public activeAccount = '';
  public currentHost = '';

  public currencyRate: Currency = {
    name: '',
    value: 0,
  };


  public currencyRates: Currency[];

  constructor(
    private transactionServ: TransactionService,
    private menuController: MenuController,
    private router: Router,
    private storage: Storage,
    private activeAccountSrv: ActiveAccountService
  ) {
    this.activeAccountSrv.accountSubject.subscribe({
      next: v => {
        this.activeAccount = v.accountName;
      }
    });
  }

  async ngOnInit() {
    this.getActiveAccount();
    const account = await this.storage.get('active_account');
    this.activeAccount = account.accountName;
  }

  // switchNetwork(host: string) {
  //    this.transactionServ.setRpcUrl(host);
  //    this.currentHost = host;
  //    console.log('Set new host: ', host);
  //  }

  revealPassphrase() {
    this.router.navigateByUrl('/backup-phrase');
    this.menuController.close('mainMenu');
  }

  myTasks() {
    this.router.navigateByUrl('/my-tasks');
    this.menuController.close('mainMenu');
  }

  openAboutView() {
    this.router.navigateByUrl('/about');
    this.menuController.close('mainMenu');
  }

  openListAccount() {
    this.router.navigateByUrl('/list-account');
    this.menuController.close('mainMenu');
  }

  openSettings(){
    this.router.navigateByUrl('/settings');
    this.menuController.close('mainMenu');
  }

  openAddresBook() {
    this.router.navigateByUrl('/address-book');
    this.menuController.close('mainMenu');
  }

  openSendFeedbak() {
    this.router.navigateByUrl('/feedback');
    this.menuController.close('mainMenu');
  }

  openHelpSupport() {
    this.router.navigateByUrl('/help');
    this.menuController.close('mainMenu');
  }

  openAppsList() {
    this.router.navigateByUrl('/applist');
    this.menuController.close('mainMenu');
  }

  openNotifications() {
    this.router.navigateByUrl('/notifications');
  }

  openMenu() {
    this.menuController.open('first');
  }

  goToGenerate() {
    this.router.navigateByUrl('/create-account');
    this.menuController.close('mainMenu');
  }

  logout() {
    this.router.navigateByUrl('/login');
    this.menuController.close('mainMenu');
  }

  async getActiveAccount() {
    const accounts = await this.storage.get('accounts');
    const account = await this.storage.get('active_account');
    accounts.forEach((acc, index) => {
      console.log(
        acc.accountProps.derivationPath === account.accountProps.derivationPath,
        acc.accountProps.derivationPath,
        account.accountProps.derivationPath
      );
      if (
        acc.accountProps.derivationPath === account.accountProps.derivationPath
      ) {
        this.activeAccount = index;
      }
    });
  }
}
