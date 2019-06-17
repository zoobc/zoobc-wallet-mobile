import { Component, Inject, OnInit } from '@angular/core';
import { KeyringService } from '../core/keyring.service';

import { byteArrayToHex, publicKeyToAddress, addressToPublicKey } from '../../helpers/converters'
import { SendMoneyTx } from '../../helpers/serializers';

// import { calcBip32ExtendedKey } from '../core/keyring.service';

const coinName = "SPN"

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
    console.log("bip44 coinName:", coinName)
  }

  testService() {
    let { phrase } = this.keyringService.generateRandomPhrase()
    console.log("new phrase:", phrase)

    phrase = "cable spray genius state float twenty onion head street palace net private method loan turn phrase state blanket interest dry amazing dress blast tube"
    const passphrase = "p4ssphr4se"

    console.log("masterPhrase:", phrase)
    console.log("masterPassphrase:", passphrase)


    // Root-Key Operation
    const { seed, bip32RootKey } = this.keyringService.calcBip32RootKeyFromSeed(coinName, phrase, passphrase)
    console.log("masterSeed:", seed)
    console.log("rootKey:", bip32RootKey)

    // console.log("sep5TestVector:", calcBip32ExtendedKey("m/44'/148'", bip32RootKey, "ed25519"))

    // Child-Key/Seed operation
    const account0 = this.keyringService.calcForDerivationPathForCoin(coinName, 0, 0, bip32RootKey)
    console.log("account0:", account0)

    // Ed25519-KeyPair operation
    const { derivationPrivKey: accountSeed } = account0
    const { publicKey, secretKey } = this.sign.keyPair.fromSeed(accountSeed)
    console.log("account m/44'/148'/0' privateKey:", byteArrayToHex(accountSeed))
    console.log("account m/44'/148'/0' publicKey:", byteArrayToHex(publicKey))
    console.log("account m/44'/148'/0' address:", publicKeyToAddress(publicKey))

    // Generate-TX operation
    // const tx = SendMoneyTx.from({ amount: 1, fee: 1 });
    const tx = new SendMoneyTx();
    tx.senderPublicKey = publicKey;
    tx.recipientPublicKey = addressToPublicKey("RmKSf9_h-v1jW59kOsyfhoIVBKLXGOv91E9lgMIx25vh");
    tx.amount = 1;
    tx.fee = 1;
    tx.timestamp = Date.now() / 1000;
    const txBytes = tx.toBytes();
    console.log("unsignedTxBytes:", byteArrayToHex(txBytes))

    // Sign-TX operation
    const signature = this.sign.detached(txBytes, secretKey)
    console.log("txSignature:", byteArrayToHex(signature))
    txBytes.set(signature, 123)
    console.log("signedTxBytes:", byteArrayToHex(txBytes))
  }

}
