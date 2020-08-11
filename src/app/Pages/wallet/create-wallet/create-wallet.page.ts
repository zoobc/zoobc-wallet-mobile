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
  public placeholderOne;
  public placeholderTwo;
  public arrayClass = [];
  public errorMsg = '';
  public isPinSetup = false;

  constructor(private navCtrl: NavController,
              private accountSrv: AccountService,
              private router: Router) { }

  ngOnInit() {
    this.arrayPhrase = this.accountSrv.getArrayPassphrase().slice();
    this.arrayPhraseOri = this.accountSrv.getArrayPassphrase().slice();
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
      this.placeholderOne = Math.floor(Math.random() * 23);
      this.placeholderTwo = Math.floor(Math.random() * 23);
      this.arrayPhrase[this.placeholderOne]='';
      this.arrayPhrase[this.placeholderTwo]='';
  }

  goback() {
    this.navCtrl.pop();

  }
}
