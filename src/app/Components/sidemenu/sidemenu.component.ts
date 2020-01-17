import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LanguageService } from 'src/app/Services/language.service';
import { CurrencyService, Currency } from 'src/app/Services/currency.service';
import { ActiveAccountService } from 'src/app/Services/active-account.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
  public accounts = [];
  public activeCurrency = 'USD';
  public activeAccount = '';

  public currencyRate: Currency = {
    name: '',
    value: 0,
  };

  public currencyRates: Currency[];

  constructor(
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

  revealPassphrase() {
    this.menuController.close('mainMenu');
    this.router.navigateByUrl('/backup-phrase');
  }

  myTasks() {
    this.menuController.close('mainMenu');
    this.router.navigateByUrl('/my-tasks');
  }

  openAboutView() {
    this.menuController.close('mainMenu');
    this.router.navigateByUrl('/about');
  }

  openListAccount() {
    this.router.navigateByUrl('/list-account');
  }

  openSettings(){
    this.menuController.close('mainMenu');
    this.router.navigateByUrl('/settings');
  }

  openAddresBook() {
    this.menuController.close('mainMenu');
    this.router.navigateByUrl('/address-book');
  }

  openSendFeedbak() {
    this.router.navigateByUrl('/feedback');
  }

  openHelpSupport() {
    this.menuController.close('mainMenu');
    this.router.navigateByUrl('/help');
  }
  
  openAppsList() {
    this.menuController.close('mainMenu');
    this.router.navigateByUrl('/applist');
  }

  openNodeAdmin() {
    this.router.navigateByUrl('/node-admin');
  }

  openNotifications() {
    this.router.navigateByUrl('/notifications');
  }

  openMenu() {
    this.menuController.open('first');
  }

  goToGenerate() {
    this.router.navigate(['/create-account']);
  }

  logout() {
    this.router.navigate(['/login']);
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
