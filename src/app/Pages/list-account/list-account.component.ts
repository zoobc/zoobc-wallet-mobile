import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/Services/account.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Account } from 'src/app/Interfaces/account';
import { FOR_SENDER, FOR_RECIPIENT, FOR_ACCOUNT, NEW_MODE, EDIT_MODE } from 'src/environments/variable.const';
import { UtilService } from 'src/app/Services/util.service';

@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  styleUrls: ['./list-account.component.scss']
})
export class ListAccountComponent implements OnInit {

  private forWhat: string;
  accounts: Account[];

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
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.forWhat = this.router.getCurrentNavigation().extras.state.forWhat;
      }
    });
    this.loadData();
  }

  async loadData() {
    this.accounts =  await this.accountService.getAllAccount();
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
    this.openAddAccount(null, NEW_MODE);
  }

  editName(account: Account) {
    this.openAddAccount(account, EDIT_MODE);
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
}
