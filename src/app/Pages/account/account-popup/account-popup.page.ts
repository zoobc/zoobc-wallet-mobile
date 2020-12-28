import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/Services/account.service';
import { ModalController } from '@ionic/angular';
import zoobc from 'zbc-sdk';
@Component({
  selector: 'app-account-popup',
  templateUrl: './account-popup.page.html',
  styleUrls: ['./account-popup.page.scss'],
})
export class AccountPopupPage implements OnInit {

  accType = 'normal';
  accounts: any;
  account: any;
  isLoadingBalance: boolean;
  constructor(private accountService: AccountService,
              private modalController: ModalController) { }

  async ngOnInit() {
    if (this.accType === 'multisig') {
      this.accounts = await this.accountService.allAccount('multisig');
    } else {
      this.accounts = await this.accountService.allAccount('normal');
    }

    if (this.accounts && this.accounts.length > 0) {
      this.getAllAccountBalance(this.accounts);
    }

  }

  accountClicked(account: any) {
      this.account = account;
      this.closeModal();
  }

  async closeModal() {
    await this.modalController.dismiss(this.account);
  }

  async close() {
    await this.modalController.dismiss();
  }

  async getAllAccountBalance(accounts: any) {
    this.isLoadingBalance = true;
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
    this.isLoadingBalance = false;
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

}
