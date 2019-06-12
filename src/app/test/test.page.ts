import { Component, OnInit } from '@angular/core';
import { KeyringService } from '../core/keyring.service';
import * as bip32 from 'bip32'

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  constructor(
    private keyringService: KeyringService
  ) { }

  ngOnInit() {
    console.log("bip32")
  }

  testService() {
    console.log("bip32", bip32)
    const { phrase } = this.keyringService.generateRandomPhrase()
    console.log("phrase:", phrase)
  }

}
