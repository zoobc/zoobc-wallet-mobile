import { Component, OnInit } from '@angular/core';
import { KeyringService } from '../core/keyring.service';

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
  }

  testService() {
    const { phrase } = this.keyringService.generateRandomPhrase()
    console.log("phrase:", phrase)
  }

}
