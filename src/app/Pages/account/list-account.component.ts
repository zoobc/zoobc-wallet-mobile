import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/Services/account.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Account } from 'src/app/Interfaces/account';
import { FOR_SENDER, FOR_RECIPIENT, FOR_ACCOUNT, MODE_NEW, FOR_APPROVER, STORAGE_ALL_ACCOUNTS } from 'src/environments/variable.const';
import zoobc from 'zoobc-sdk';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { StoragedevService } from 'src/app/Services/storagedev.service';
import { ImportAccountPage } from './import-account/import-account.page';
import { QrScannerService } from 'src/app/Services/qr-scanner.service';
@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  styleUrls: ['./list-account.component.scss']
})
export class ListAccountComponent implements OnInit {
  
  forWhat: string;
  accounts: Account[];
  isError: boolean;
  isLoadingBalance: boolean;
  accountBalance: any;
  errorMsg: string;

  constructor(
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private strgSrv: StoragedevService,
    private modalController: ModalController,
    private router: Router,
    private qrScannerService: QrScannerService,
    private accountService: AccountService) {

      this.qrScannerService.qrScannerSubject.subscribe(address => {
        this.getScannerResult(address);
      });

      this.accountService.accountSubject.subscribe(() => {
      setTimeout(() => {
        this.loadData();
      }, 500);
    });
  }

  ngOnInit() {
    this.loadData();
  }

  isSavedAccount(obj: any): obj is Account {
    if ((obj as Account).type) { return true; }
    return false;
  }

  async getScannerResult(arg: string) {

    const fileResult = JSON.parse(arg);
    if (!this.isSavedAccount(fileResult)) {
      alert('You scan wrong QRCode');
      return;
    }

    const accountSave: Account = fileResult;
    console.log('== accountSave: ', accountSave);

    const allAcc  = await this.accountService.allAccount('multisig');
    const idx = allAcc.findIndex(acc => acc.address === accountSave.address);
    if (idx >= 0) {
      alert('Account with that address is already exist');
      return;
    }

    try {
      await this.accountService.addAccount(accountSave).then(() => {

      });
    } catch {
      alert ('Error when scanning account, please try again later!');
    } finally {
    }

  }

  async loadData() {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        this.forWhat = this.router.getCurrentNavigation().extras.state.forWhat;
      } else {
        this.forWhat = null;
      }
    });
    this.accounts = await this.accountService.allAccount();
    if (this.accounts && this.accounts.length > 0) {
      this.getAllAccountBalance(this.accounts);
    }
  }

  async deleteAccount(index: number) {
    const currAccount = await this.accountService.getCurrAccount();
    if (this.accounts[index].address === currAccount.address) {
        alert('Cannot delete active account, please switch account, and try again!');
        return;
    }

    const confirmation = await this.alertCtrl.create({
      message: 'Are you sure want to delete this account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Yes',
          handler: () => {
            this.accounts.splice(index, 1);
            this.strgSrv.set(STORAGE_ALL_ACCOUNTS, this.accounts);
          }
        }
      ]
    });

    await confirmation.present();
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
      this.isLoadingBalance = false;
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

  scanQrCode() {
    this.router.navigateByUrl('/qr-scanner');
  }

  async importAccount() {
    const pinmodal = await this.modalController.create({
      component: ImportAccountPage,
      componentProps: {}
    });

    pinmodal.onDidDismiss().then(returnedData => {
      console.log('=== returneddata: ', returnedData);
      if (returnedData && returnedData.data !== 0) {
        alert('Account has been successfully imported');
      }
    });
    return await pinmodal.present();
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

  createNewAccount() {
    this.openAddAccount(null, MODE_NEW);
  }

  editName(account: Account) {
    this.openEditAccount(account, 1);
  }

  viewAccount(account: Account) {
    this.openEditAccount(account, 0);
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

  async openEditAccount(arg: Account, mode: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        account: JSON.stringify(arg),
        mode
      }
    };
    this.router.navigate(['/edit-account'], navigationExtras);
  }
}
