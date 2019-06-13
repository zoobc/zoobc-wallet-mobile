import { Component, Inject, OnInit } from '@angular/core';
import { KeyringService } from '../core/keyring.service';
// import * as bip32 from 'bip32'

import { hexToArrayByte, arrayByteToHex, publicKeyToAddress } from '../../helpers/converters'

// import { calcBip32ExtendedKey } from '../core/keyring.service';
// import { getMasterKeyFromSeed, derivePath } from '../../../externals/hd-key';

// export function arrayByteToHex(bytes) {
//   return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
// }

// export function stringToArrayByte(str) {
//   str = unescape(encodeURIComponent(str)); //temporary

//   var bytes = new Array(str.length);
//   for (var i = 0; i < str.length; ++i)
//       bytes[i] = str.charCodeAt(i);

//   return Uint8Array.from(bytes);
// }

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
    let { phrase } = this.keyringService.generateRandomPhrase()
    console.log("new phrase:", phrase)

    phrase = "cable spray genius state float twenty onion head street palace net private method loan turn phrase state blanket interest dry amazing dress blast tube"
    console.log("phrase:", phrase)

    const { seed, bip32RootKey } = this.keyringService.calcBip32RootKeyFromSeed("SPN", phrase, "p4ssphr4se")
    console.log("seed:", seed)
    console.log("bip32RootKey:", bip32RootKey)
    // console.log("bip32RootKey:", getMasterKeyFromSeed(seed))

    // console.log("sep5TestVector:", calcBip32ExtendedKey("m/44'/148'", bip32RootKey, "ed25519"))
    // console.log("sep5TestVector:", derivePath("m/44'/148'", seed))

    const account0 = this.keyringService.calcForDerivationPathForCoin("SPN", 0, 0, bip32RootKey)
    console.log("account0:", account0)
    // console.log("account0:", derivePath("m/44'/148'/0'", seed))

    // const account1 = this.keyringService.calcForDerivationPathForCoin("BTC", 1, 0, bip32RootKey)
    // console.log("account1:", account1)

    console.debug(arrayByteToHex(this.keyringService.extendedSeed))
    const { publicKey, secretKey } = this.sign.keyPair.fromSeed(this.keyringService.extendedSeed)
    console.log("account m/44'/148'/0' secretKey:", arrayByteToHex(secretKey))
    console.log("account m/44'/148'/0' publicKey:", arrayByteToHex(publicKey))
    console.log("account m/44'/148'/0' address:", publicKeyToAddress(secretKey))

    const txBytes = hexToArrayByte("0100018407025d3c00000004264abef89b96225a837f9d6a2ccc09e8b1422e090c0fa3852bb139d99caec404264a2ef814619d4a2b1fa3b45f4aa09b248d53ef07d8e92237f3cc8eb30d6d809698000000000000e1f5050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004264a2ef814619d4a2b1fa3b45f4aa09b248d53ef07d8e92237f3cc8eb30d6d809698000000000000e1f50500000000")
    console.log("sign data:", arrayByteToHex(txBytes))
    const signature = this.sign.detached(txBytes, secretKey)
    console.log("account m/44'/148'/0' signature:", arrayByteToHex(signature))
  }

}
