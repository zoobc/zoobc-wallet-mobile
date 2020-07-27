import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/Services/account.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Account } from 'src/app/Interfaces/account';
import { FOR_SENDER, FOR_RECIPIENT, FOR_ACCOUNT, MODE_NEW, MODE_EDIT, FOR_APPROVER } from 'src/environments/variable.const';
import { UtilService } from 'src/app/Services/util.service';
import zoobc from 'zoobc-sdk';
import { NavController } from '@ionic/angular';
import { makeShortAddress } from 'src/Helpers/converters';
@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  styleUrls: ['./list-account.component.scss']
})
export class ListAccountComponent implements OnInit {

  private forWhat: string;
  accounts: Account[];
  isError: boolean;
  isLoadingBalance: boolean;
  accountBalance: any;
  errorMsg: string;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router,
    private utilService: UtilService,
    private accountService: AccountService  ) {
    this.accountService.accountSubject.subscribe(() => {
      setTimeout(() => {
        this.loadData();
      }, 500);
    });
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.route.queryParams.subscribe( () => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        this.forWhat = this.router.getCurrentNavigation().extras.state.forWhat;
      } else {
        this.forWhat = null;
      }
    });
    this.getAllAccountBalance();
  }


  async getAllAccountBalance() {
    this.accounts = await this.accountService.allAccount();
    if (this.accounts && this.accounts.length > 0) {
      this.isLoadingBalance = true;
      this.accounts.forEach(obj => {
          const adres = obj.address;
          this.getBalanceByAddress(adres).then(balnce => {
            obj.balance = Number(balnce.spendablebalance);
          });
      });
    }

  }

  private async getBalanceByAddress(address: string) {
    return await zoobc.Account.getBalance(address)
      .then(data => {
        return data.accountbalance;
      }).finally(() => (this.isLoadingBalance = false));
  }


  accountClicked(account: Account) {
    if (!this.forWhat) {
      return;
    }

    this.accountService.setForWhat(this.forWhat);
    if (this.forWhat === FOR_ACCOUNT) {
      this.accountService.setActiveAccount(account);
    } else if (this.forWhat === FOR_SENDER) {
      this.accountService.setSender(account);
    } else if (this.forWhat === FOR_RECIPIENT) {
      this.accountService.setRecipient(account);
    } else if (this.forWhat === FOR_APPROVER) {
      this.accountService.setApprover(account);
    }
    this.navCtrl.pop();
  }

  copyAddress(account: Account) {
    const val = account.address;
    this.utilService.copyToClipboard(val);
  }

  createNewAccount() {
    this.openAddAccount(null, MODE_NEW);
  }

  editName(account: Account) {
    this.openEditAccount(account);
  }

  async openAddAccount(arg: Account, trxMode: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        account: JSON.stringify(arg),
        mode: trxMode
      }
    };
    this.router.navigate(['/create-account'], navigationExtras);
  }

  shortAddress(address: string) {
      return makeShortAddress(address);
  }

  async openEditAccount(arg: Account) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        account: JSON.stringify(arg),
      }
    };
    this.router.navigate(['/edit-account'], navigationExtras);
  }
}
