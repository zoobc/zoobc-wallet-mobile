import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-generate-passphrase',
  templateUrl: './generate-passphrase.page.html',
  styleUrls: ['./generate-passphrase.page.scss'],
})
export class GeneratePassphrasePage implements OnInit {

  private writtenDown = false
  private terms = false
  private setupPin = false


  constructor() { }

  ngOnInit() {
    this.checkSetupPin();
  }

  checkSetupPin() {
    if(this.writtenDown && this.terms) {
      this.setupPin = true
    }
  }

}
