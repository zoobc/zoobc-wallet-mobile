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
    let { phrase } = this.keyringService.generateRandomPhrase()
    console.log("phrase:", phrase)
    phrase = "cable spray genius state float twenty onion head street palace net private method loan turn phrase state blanket interest dry amazing dress blast tube"
    console.log("phrase:", phrase)
    const { seed, bip32RootKey } = this.keyringService.calcBip32RootKeyFromSeed("BTC", phrase, "p4ssphr4se")
    console.log("seed:", seed)
    const result = this.keyringService.calcForDerivationPathForCoin("BTC", "0", "0", bip32RootKey)
    console.log("result:", result)
  }

}
