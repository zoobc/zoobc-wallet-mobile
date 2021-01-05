import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/Services/account.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Account } from 'src/app/Interfaces/account';
import { FOR_SENDER, FOR_RECIPIENT, FOR_ACCOUNT, MODE_NEW, FOR_APPROVER, STORAGE_ALL_ACCOUNTS } from 'src/environments/variable.const';
import zoobc from 'zbc-sdk';
import { NavController, ModalController, AlertController, PopoverController } from '@ionic/angular';
import { StorageService } from 'src/app/Services/storage.service';
import { ImportAccountPage } from './import-account/import-account.page';
import { QrScannerService } from 'src/app/Services/qr-scanner.service';
import { UtilService } from 'src/app/Services/util.service';
import { PopoverOptionComponent } from 'src/app/Components/popover-option/popover-option.component';
import { PopoverActionComponent } from './popover-action/popover-action.component';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

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
    private strgSrv: StorageService,
    private modalController: ModalController,
    private router: Router,
    private qrScannerService: QrScannerService,
    private accountService: AccountService,
    private popoverCtrl: PopoverController,
    private utilSrv: UtilService,
    private translateSrv: TranslateService
  ) {

    this.qrScannerService.qrScannerSubject.subscribe(address => {
      this.getScannerResult(address);
    });

    this.accountService.accountSubject.subscribe(() => {
      setTimeout(() => {
        this.loadData();
      }, 500);
    });
  }

  private textCopyAddress: string;
  private textEditAccount: string;
  private textViewAccount: string;
  private textDeleteAccount: string;
  private textWrongQrCode: string;
  private textAddressExists: string;
  private textErrorScan: string;
  private textAccountImported: string;

  ngOnInit() {
    this.loadData();

    this.translateSrv.onLangChange.subscribe(() => {
      this.translateLang();
    });

    this.translateLang();
  }

  translateLang() {
    this.translateSrv.get([
      'copy address',
      'edit account',
      'view account',
      'delete account',
      'you scan wrong qrcode',
      'account with that address is already exist',
      'error when scanning account, please try again later!',
      'account has been successfully imported'
    ]).subscribe((res: any) => {
      this.textCopyAddress = res['copy address'];
      this.textEditAccount = res['edit account'];
      this.textViewAccount = res['view account'];
      this.textDeleteAccount = res['delete account'];
      this.textWrongQrCode = res['you scan wrong qrcode'];
      this.textAddressExists = res['account with that address is already exist'];
      this.textErrorScan = res['error when scanning account, please try again later!'];
      this.textAccountImported = res['account has been successfully imported'];
    });
  }

  isSavedAccount(obj: any): obj is Account {
    if ((obj as Account).type) { return true; }
    return false;
  }

  async getScannerResult(arg: string) {

    const fileResult = JSON.parse(arg);
    if (!this.isSavedAccount(fileResult)) {
      alert(this.textWrongQrCode);
      return;
    }

    const accountSave: Account = fileResult;
    console.log('== accountSave: ', accountSave);

    const allAcc = await this.accountService.allAccount('multisig');
    const idx = allAcc.findIndex(acc => acc.address === accountSave.address);
    if (idx >= 0) {
      alert(this.textAddressExists);
      return;
    }

    try {
      await this.accountService.addAccount(accountSave).then(() => {

      });
    } catch {
      alert(this.textErrorScan);
    } finally {
    }

  }

  async doRefresh(event: any) {
    this.isLoadingBalance = true;
    await this.accountService.fetchAccountsBalance();
    this.loadData();
    this.isLoadingBalance = false;
    event.target.complete();
  }

  async loadData() {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        this.forWhat = this.router.getCurrentNavigation().extras.state.forWhat;
      } else {
        this.forWhat = null;
      }
    });
    this.accounts = await this.accountService.getAccountsWithBalance();
  }

  async deleteAccount(index: number) {
    console.log('Account: ', this.accounts[index]);
    const currAccount = await this.accountService.getCurrAccount();
    if (this.accounts[index].address.value === currAccount.address.value) {
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
            console.log('=== newAccounts: ', this.accounts);
            this.strgSrv.setObject(STORAGE_ALL_ACCOUNTS, this.accounts);
          }
        }
      ]
    });

    await confirmation.present();
  }


  scanQrCode() {
    this.router.navigateByUrl('/qr-scanner');
  }

  async importAccount() {
    const importAcc = await this.modalController.create({
      component: ImportAccountPage,
      componentProps: {}
    });

    importAcc.onDidDismiss().then(returnedData => {
      console.log('=== returneddata: ', returnedData);
      if (returnedData && returnedData.data !== 0) {
        alert(this.textAccountImported);
      }
    });
    return await importAcc.present();
  }

  async editDataSet(acc: Account) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        account: JSON.stringify(acc)
      }
    };
    this.router.navigate(['/dataset-account'], navigationExtras);
  }

  accountClicked(account: Account) {
    if (!this.forWhat) {
      return;
    }

    this.accountService.setForWhat(this.forWhat);
    if (this.forWhat === FOR_ACCOUNT) {
      this.accountService.switchAccount(account);
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

  async showAction(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopoverActionComponent,
      event: ev,
      translucent: true
    });

    popover.onWillDismiss().then(({ data: action }) => {
      switch (action) {
        case 'add':
          this.createNewAccount();
          break;
        case 'import':
          this.importAccount();
          break;
        case 'scan':
          this.scanQrCode();
          break;
      }
    });

    return popover.present();
  }

  async showOption(ev: any, index: number) {

    const account = this.accounts[index];

    const popoverOptions = [
      {
        key: 'edit',
        label: this.textEditAccount
      },
      {
        key: 'copy',
        label: this.textCopyAddress
      }
    ];

    if (account.type && account.type === 'multisig') {
      popoverOptions.push(
        {
          key: 'view',
          label: this.textViewAccount
        }
      );
      popoverOptions.push(
        {
          key: 'delete',
          label: this.textDeleteAccount
        }
      );
    }

    const popover = await this.popoverCtrl.create({
      component: PopoverOptionComponent,
      componentProps: {
        options: popoverOptions
      },
      event: ev,
      translucent: true
    });

    popover.onWillDismiss().then(({ data: action }) => {
      switch (action) {
        case 'edit':
          this.editName(account);
          break;
        case 'copy':
          this.utilSrv.copyToClipboard(account.address.value);
          break;
        case 'view':
          this.viewAccount(account);
          break;
        case 'delete':
          this.deleteAccount(index);
          break;
      }
    });

    return popover.present();
  }
}
