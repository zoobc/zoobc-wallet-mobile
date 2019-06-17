import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ObservableService } from 'src/services/observable.service';
import { ACTIVE_ACCOUNT } from 'src/environments/variable.const';
import { AccountService } from 'src/services/account.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {
  private accounts = []
  private activeAccount = 0

  constructor(
    private menuController: MenuController,
    private router: Router,
    private storage: Storage,
    private Obs: ObservableService,
    private accountService: AccountService
  ) { }

  ionViewWillEnter() {
    console.log("test")
  }

  ngOnInit() {
    this.getListAccounts()
  }

  ngOnChanges() {
    this.getListAccounts()
  }

  openMenu() {
    this.menuController.open("first")
  }

  goToGenerate() {
    this.router.navigate(['/generate-passphrase'])
  }

  async getListAccounts() {
    const accounts = await this.storage.get('accounts')
    accounts.forEach(account => {
      const address = this.accountService.getAccountAddress(account)
      this.accounts.push({...account, address})
    });
  }

  async selectAccount() {
    this.Obs.Set(ACTIVE_ACCOUNT, this.accounts[this.activeAccount])
    const account = await this.storage.set('active_account', this.accounts[this.activeAccount])
    console.log("account", account)
  }

}
