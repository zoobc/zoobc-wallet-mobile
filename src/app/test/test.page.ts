import { Component, Inject, OnInit } from '@angular/core';
import { KeyringService } from '../core/keyring.service';
import * as bip32 from 'bip32'

<<<<<<< HEAD
// import { calcBip32ExtendedKey } from '../core/keyring.service';
=======
import { calcBip32ExtendedKey } from '../core/keyring.service';
>>>>>>> cfcc4e32980ef61f5ee6498f2839fa17715f2fc2
// import { getMasterKeyFromSeed, derivePath } from '../../../externals/hd-key';

export function arrayByteToHex(bytes) {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}

export function stringToArrayByte(str) {
  str = unescape(encodeURIComponent(str)); //temporary

  var bytes = new Array(str.length);
  for (var i = 0; i < str.length; ++i)
      bytes[i] = str.charCodeAt(i);

  return Uint8Array.from(bytes);
}

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  constructor(
    private keyringService: KeyringService,
    @Inject("nacl.sign") private sign: any
  ) { }

  ngOnInit() {
    console.log("bip32")
  }

  testService() {
    // console.log("bip32", bip32)
    // let { phrase } = this.keyringService.generateRandomPhrase()
    // console.log("phrase:", phrase)
    // phrase = "cable spray genius state float twenty onion head street palace net private method loan turn phrase state blanket interest dry amazing dress blast tube"
    // console.log("phrase:", phrase)

    // const { seed, bip32RootKey } = this.keyringService.calcBip32RootKeyFromSeed("SPN", phrase, "p4ssphr4se")
    // console.log("seed:", seed)
    // console.log("bip32RootKey:", bip32RootKey)
    // // console.log("bip32RootKey:", getMasterKeyFromSeed(seed))

    // console.log("stellarRootKey:", calcBip32ExtendedKey("m/44'/148'", bip32RootKey, "ed25519"))
    // // console.log("stellarRootKey:", derivePath("m/44'/148'", seed))

    // const account0 = this.keyringService.calcForDerivationPathForCoin("SPN", 0, 0, bip32RootKey)
    // console.log("account0:", account0)
    // // console.log("account0:", derivePath("m/44'/148'/0'", seed))

    // // const account1 = this.keyringService.calcForDerivationPathForCoin("BTC", 1, 0, bip32RootKey)
    // // console.log("account1:", account1)

    // const seedKey = this.keyringService.extendedSeed
    // console.log("account m/44'/148'/0' privateKey:", arrayByteToHex(seedKey))
    // const { publicKey, secretKey } = this.sign.keyPair.fromSeed(seedKey)
    // console.log("account m/44'/148'/0' publicKey:", arrayByteToHex(publicKey))

    // const message = "test"
    // console.log("message to sign:", message)
    // const signature = this.sign.detached(stringToArrayByte(message), secretKey)
    // console.log("account m/44'/148'/0' sign:", arrayByteToHex(signature))
  }

}
