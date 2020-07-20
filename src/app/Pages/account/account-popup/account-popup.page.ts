import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/Services/account.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-account-popup',
  templateUrl: './account-popup.page.html',
  styleUrls: ['./account-popup.page.scss'],
})
export class AccountPopupPage implements OnInit {

  accType = 'normal';
  accounts: any;
  account: any;
  constructor(private accountService: AccountService,
              private modalController: ModalController) { }

  async ngOnInit() {
    console.log('== acctype: ', this.accType);

    if (this.accType === 'multisig') {
      console.log('== enter multisig');
      this.accounts = await this.accountService.allAccount('multisig');
    } else {
      console.log('== enter non multisig');
      this.accounts = await this.accountService.allAccount('normal');
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
}
