import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AccountService } from 'src/app/Services/account.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { AccountInf } from 'src/app/Services/auth-service';
import { FOR_SENDER, FOR_RECIPIENT, FOR_ACCOUNT, NEW_MODE, EDIT_MODE } from 'src/environments/variable.const';

@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  styleUrls: ['./list-account.component.scss']
})
export class ListAccountComponent implements OnInit {

  private forWhat: string;
  accounts: AccountInf[];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private toastController: ToastController
  ) {
    this.accountService.accountSubject.subscribe(() => {
      this.loadData();
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

  loadData() {
    this.accounts = this.accountService.getAllAccount();
  }

  accountClicked(account: AccountInf) {
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
    this.router.navigateByUrl('/tabs/dashboard');
  }

  goToSendMoney() {
    this.router.navigateByUrl('/sendcoin');
  }

  copyAddress(account: AccountInf) {

    const val = account.address;
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
      message: 'Copied to clipboard.',
      duration: 2000
    });

    toast.present();
  }

  createNewAccount() {
    this.openAddAccount(null, NEW_MODE);
  }

  editName(account: AccountInf) {
    this.openAddAccount(account, EDIT_MODE);
  }

  async openAddAccount(arg: AccountInf, trxMode: string) {
    console.log('====== Accoint will edited', arg);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        account: JSON.stringify(arg),
        mode: trxMode
      }
    };
    this.router.navigate(['/create-account'], navigationExtras);
  }
}
