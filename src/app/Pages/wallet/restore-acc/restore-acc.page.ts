import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AccountService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-restore-acc',
  templateUrl: './restore-acc.page.html',
  styleUrls: ['./restore-acc.page.scss'],
})
export class RestoreAccPage implements OnInit {

  isRestoring = false;
  constructor(
    private navCtrl: NavController,
    private accountService: AccountService) {
  }

  ngOnInit() {

  }

  async restore() {
    this.isRestoring = true;
    await this.accountService.restoreAccounts();
    this.navCtrl.navigateRoot('/tabs/home');
  }

  next() {
      this.navCtrl.navigateRoot('/tabs/home');
  }

}
