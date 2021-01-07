import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Account, AccountType } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-popover-account',
  templateUrl: './popover-account.component.html',
  styleUrls: ['./popover-account.component.scss']
})
export class PopoverAccountComponent implements OnInit {
  accounts: Account[];
  selectedIndex: number;
  predefList = [];
  showBalance = 'yes';
  @Input() accountType: AccountType;
  isLoading = false;
  constructor(
    public popoverCtrl: PopoverController,
    private router: Router,
    private accountSrv: AccountService
  ) { }

  async ngOnInit() {
    this.isLoading = true;
    let accs: Account[];

    if (this.showBalance === 'yes') {
      accs = await this.accountSrv.getAccountsWithBalance();
    } else {
      accs = await this.accountSrv.allAccount();
    }

    if (this.predefList && this.predefList.length > 0) {
      this.isLoading = false;
      this.accounts = accs.filter( acc => {// for every object in heroes
          return this.predefList.includes(acc.address.value);
      });
      return;
    }

    if (this.accountType) {
      this.accounts = accs.filter((account: Account) => {
        return account.type && account.type === this.accountType;
      });
    } else {
      this.accounts = accs;
    }


    const selectedAccount = await this.accountSrv.getCurrAccount();
    this.selectedIndex = this.accounts.findIndex((account: Account) => {
      return account.address === selectedAccount.address;
    });

    this.isLoading = false;
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
