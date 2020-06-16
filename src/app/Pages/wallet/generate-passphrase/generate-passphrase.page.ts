import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/Services/util.service';
import { ZooKeyring } from 'zoobc-sdk';
import { AccountService } from 'src/app/Services/account.service';

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
  lang: string;

  languages: Languages[] = [
    { value: 'chinese_simplified', viewValue: 'Chinese Simplified' },
    { value: 'english', viewValue: 'English' },
    { value: 'japanese', viewValue: 'Japanese' },
    { value: 'spanish', viewValue: 'Spanish' },
    { value: 'italian', viewValue: 'Italian' },
    { value: 'french', viewValue: 'French' },
    { value: 'korean', viewValue: 'Korean' },
    { value: 'chinese_traditional', viewValue: 'Chinese Traditional' },
  ];


  constructor(
    private router: Router,
    private utilService: UtilService,
    private accountSrv: AccountService
  ) {
  }

  ngOnInit() {
    this.lang = 'english';
    this.generatePassphrase();
  }

  onLanguageChanged(language: string) {
    console.log('== language:', language);
    // this.lang = language;
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
    this.accountSrv.setPlainPassphrase(this.plainPassphrase.slice());
    this.router.navigateByUrl('/create-wallet');
  }

  async generatePassphrase() {
    this.plainPassphrase = ZooKeyring.generateRandomPhrase(24, this.lang);
    if (this.lang === 'japanese') {
      this.arrayPhrase = this.plainPassphrase.slice().split(`${String.fromCharCode(12288)}`);
    } else {
      this.arrayPhrase = this.plainPassphrase.slice().split(' ');
    }
    this.accountSrv.setPlainPassphrase(this.plainPassphrase.slice());
    this.accountSrv.setArrayPassphrase(this.arrayPhrase);
  }

  private getPassphraseText() {
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
    return strCopy;
  }

  copyToClipboard() {
    this.utilService.copyToClipboard(this.getPassphraseText());
  }

  ionViewDidLeave(): void {
    this.writtenDown = false;
    this.terms = false;
  }
}
