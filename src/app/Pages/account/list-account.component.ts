import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/Services/account.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Account } from 'src/app/Interfaces/account';
import { FOR_SENDER, FOR_RECIPIENT, FOR_ACCOUNT, MODE_NEW, MODE_EDIT } from 'src/environments/variable.const';
import { UtilService } from 'src/app/Services/util.service';
import zoobc from 'zoobc-sdk';
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
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.forWhat = this.router.getCurrentNavigation().extras.state.forWhat;
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
            console.log('===== xxxBalance: ', balnce.spendablebalance);
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
    this.accountService.setForWhat(this.forWhat);
    if (this.forWhat === FOR_ACCOUNT) {
      this.accountService.setActiveAccount(account);
      this.goToDashboard();
    } else if (this.forWhat === FOR_SENDER) {
      this.accountService.setActiveAccount(account);
      this.goToSendMoney();
      // this.location.back();
    } else if (this.forWhat === FOR_RECIPIENT) {
      this.accountService.setRecipient(account);
      // this.location.back();
      this.goToSendMoney();
    }
  }

  goToDashboard() {
    this.router.navigateByUrl('/dashboard');
  }

  goToSendMoney() {
    this.router.navigateByUrl('/sendcoin');
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
    // console.log('====== Accoint will edited', arg);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        account: JSON.stringify(arg),
        mode: trxMode
      }
    };
    this.router.navigate(['/create-account'], navigationExtras);
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
