import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Account, AccountType } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
import zoobc from 'zoobc-sdk';

@Component({
  selector: 'app-popover-account',
  templateUrl: './popover-account.component.html',
  styleUrls: ['./popover-account.component.scss']
})
export class PopoverAccountComponent implements OnInit {
  accounts: Account[];
  selectedIndex: number;
  @Input() accountType: AccountType;

  constructor(
    public popoverCtrl: PopoverController,
    private router: Router,
    private accountSrv: AccountService
  ) { }

  async ngOnInit() {
    const accounts: Account[] = await this.accountSrv.allAccount();
    if (this.accountType) {
      this.accounts = accounts.filter((account: Account) => {
        return account.type && account.type == this.accountType;
      });
    } else {
      this.accounts = accounts;
    }

    if (this.accounts && this.accounts.length > 0) {
      this.getAllAccountBalance(this.accounts);
    }

    const selectedAccount = await this.accountSrv.getCurrAccount();
    this.selectedIndex = this.accounts.findIndex((account: Account) => {
      return account.address === selectedAccount.address;
    });
  }

  async getAllAccountBalance(accounts: any) {
    const accountAddresses = [];
    let allBalances = null;
    accounts.forEach((acc) => {
      accountAddresses.push(acc.address);
    });

    try {
      const data = await zoobc.Account.getBalances(accountAddresses);
      allBalances = data.accountbalancesList;
    } catch (error) {
      console.log('__error', error);
    }

    accounts.forEach(obj => {
      const adres = obj.address;
      obj.balance =  this.getBalanceByAddress(allBalances, adres);
    });
  }

  private getBalanceByAddress(allBalances: any, address: string) {
    const accInfo = allBalances.filter(acc => {
      return acc.accountaddress === address;
    });
    if (accInfo && accInfo.length > 0) {
      return accInfo[0].balance;
    }
    return 0;
  }

  async selectAccount(account: any) {
    this.popoverCtrl.dismiss(account);
  }

  goToAccount() {
    this.popoverCtrl.dismiss('');
    this.router.navigate(['/list-account']);
  }

  cancel() {
    this.popoverCtrl.dismiss('');
  }

}
