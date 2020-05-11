import { Component, OnInit } from '@angular/core';
import { CreateAccountService } from 'src/app/Services/create-account.service';
import * as bip39 from 'bip39';
import { Router } from '@angular/router';
import { KeyringService } from 'src/app/Services/keyring.service';
import { AccountService } from 'src/app/Services/account.service';
import { UtilService } from 'src/app/Services/util.service';

@Component({
  selector: 'app-generate-passphrase',
  templateUrl: './generate-passphrase.page.html',
  styleUrls: ['./generate-passphrase.page.scss']
})
export class GeneratePassphrasePage implements OnInit {
  writtenDown = false;
  terms = false;
  plainPassphrase: string;
  arrayPhrase = [];
  isPinSetup = false;
  pagePosition = 1;
  pageStep = 1;
  tempPin = '';
  public loginFail = false;

  constructor(
    private router: Router,
    private utilService: UtilService,
    private accountService: AccountService,
    private keyringService: KeyringService,
    private createAccSrv: CreateAccountService
  ) { }

  ngOnInit() {
    // this.checkSetupPin();
    this.generatePassphrase();
  }

  onLanguageChanged(v) {
    bip39.setDefaultWordlist(v);
    this.generatePassphrase();
  }

  setupPin(event: any) {
    // console.log('====event:', event);
    this.loginFail = false;
    const { first } = event;
    // set loginFail false && clear error message
    if (first === true) {
      return;
    }
    this.tempPin = event.pin;
    this.pagePosition++;
    this.pageStep++;
  }

  passphraseConfirmation() {
    this.createAccSrv.setPlainPassphrase(this.plainPassphrase.slice());
    this.router.navigateByUrl('/create-wallet');
  }

  async generatePassphrase() {
    const passphrase = this.keyringService.generateRandomPhrase().phrase;
    this.plainPassphrase = passphrase;
    this.createAccSrv.setPlainPassphrase(this.plainPassphrase.slice());
    this.arrayPhrase = this.plainPassphrase.slice().split(' ');
    this.createAccSrv.setArrayPassphrase(this.arrayPhrase);
    // console.log('Array phrase: ', this.arrayPhrase);
  }

  copyToClipboard() {
    const val = this.plainPassphrase.slice();
    const arrayPass = val.split(' ');
    let strCopy = 'This is your ZooBC passphrase:\n\n With order number\n-------------------------\n';
    for (let i = 0; i < arrayPass.length; i++) {
      strCopy += (i + 1) + '.' + arrayPass[i];
      if (i < 23) {
        strCopy += ',   ';
      }
      if ((i + 1) % 3 === 0) {
        strCopy += '\n';
      }
    }
    strCopy += '\n\nWithout order number\n-------------------------\n' + val;
    strCopy += '\n\n----------- End ----------\n\n';

    this.utilService.copyToClipboard(strCopy);

  }



  ionViewDidLeave(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.writtenDown = false;
    this.terms = false;
  }
}
