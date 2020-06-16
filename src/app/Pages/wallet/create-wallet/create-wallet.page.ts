import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.page.html',
  styleUrls: ['./create-wallet.page.scss']
})
export class CreateWalletPage implements OnInit {

  public arrayPhrase = [];
  public disabledBox = [];
  public arrayPhraseOri = [];
  public arrayClass = [];
  public errorMsg = '';
  public isPinSetup = false;

  constructor(private navCtrl: NavController,
              private accountSrv: AccountService,
              private router: Router) { }

  ngOnInit() {
    this.arrayPhrase = this.accountSrv.getArrayPassphrase().slice();
    this.arrayPhraseOri = this.accountSrv.getArrayPassphrase().slice();
    // console.log('===== Array phrase: ', this.arrayPhrase);
    this.generateRandomBlanks();
  }

  comparePassphrase() {
    this.errorMsg = '';
    if (this.arrayPhrase.toString() === this.arrayPhraseOri.toString()) {
      this.isPinSetup = true;
    } else {
      this.isPinSetup = false;
    }
  }

  isReadonly(arg: number) {
    // console.log('number of box: ', arg);
    if (this.disabledBox[arg] === '') {
      return true;
    } else {
      return false;
    }
  }

  setupPin() {
    this.comparePassphrase();
    if (!this.isPinSetup) {
      this.errorMsg = 'Passphrase is not same!';
      return;
    }
    this.router.navigateByUrl('/setup-pin-gp');
  }

  generateRandomBlanks() {

    for (let i = 0; i <= 23; i++) {
      this.disabledBox[i] = true;
      this.arrayClass[i] = 'ion-input-readonly';
      setTimeout(() => {}, (100));
    }

    let val0 = 24;
    for (let i = 0; i < 2; i++) {
      let val = Math.floor(Math.random() * 23);
      if (val === val0) {
        val = Math.floor(Math.random() * 23);
      }
      this.disabledBox[val] = false;
      this.arrayClass[val] = 'ion-input-normal';
      this.arrayPhrase[val] = '';
      val0 = val;
      setTimeout(() => {}, (100));
    }

  }

  goback() {
    this.navCtrl.pop();

  }
}
