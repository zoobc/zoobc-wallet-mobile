import { Component, Inject, OnInit } from "@angular/core";
import { KeyringService } from "../../Services/keyring.service";
// import * as bip32 from 'bip32'

import {
  byteArrayToHex,
  publicKeyToAddress,
  addressToPublicKey
} from "../../../helpers/converters";
import { SendMoneyTx } from "../../../helpers/serializers";
import { GRPCService } from "src/app/Services/grpc.service";

// import { calcBip32ExtendedKey } from '../Services/keyring.service';

const coinName = "SPN";

@Component({
  selector: "app-test",
  templateUrl: "./test.page.html",
  styleUrls: ["./test.page.scss"]
})
export class TestPage implements OnInit {
  constructor(
    private keyringService: KeyringService,
    @Inject("nacl.sign") private sign: any,
    private grpcService: GRPCService
  ) {}

  ngOnInit() {
    console.log("bip44 coinName:", coinName);
  }

  async testService() {
    let { phrase } = this.keyringService.generateRandomPhrase();
    console.log("new phrase:", phrase);

    phrase =
      "cable spray genius state float twenty onion head street palace net private method loan turn phrase state blanket interest dry amazing dress blast tube";
    const passphrase = "p4ssphr4se";

    console.log("masterPhrase:", phrase);
    console.log("masterPassphrase:", passphrase);

    // Root-Key Operation
    const { seed, bip32RootKey } = this.keyringService.calcBip32RootKeyFromSeed(
      coinName,
      phrase,
      passphrase
    );
    console.log("masterSeed:", seed);
    console.log("rootKey:", bip32RootKey);

    // console.log("sep5TestVector:", calcBip32ExtendedKey("m/44'/148'", bip32RootKey, "ed25519"))

    // Child-Key/Seed operation
    const account0 = this.keyringService.calcForDerivationPathForCoin(
      coinName,
      0,
      0,
      bip32RootKey
    );
    console.log("account0:", account0);

    // Ed25519-KeyPair operation
    const { derivationPrivKey: accountSeed } = account0;
    const { publicKey, secretKey } = this.sign.keyPair.fromSeed(accountSeed);
    console.log(
      "account m/44'/148'/0' privateKey:",
      byteArrayToHex(accountSeed)
    );
    console.log("account m/44'/148'/0' publicKey:", byteArrayToHex(publicKey));
    console.log(
      "account m/44'/148'/0' address:",
      publicKeyToAddress(publicKey)
    );

    const txFeeNQT = 1;

    // const txBytes = hexToByteArray("0100018407025d3c00000004264abef89b96225a837f9d6a2ccc09e8b1422e090c0fa3852bb139d99caec404264a2ef814619d4a2b1fa3b45f4aa09b248d53ef07d8e92237f3cc8eb30d6d809698000000000000e1f5050000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004264a2ef814619d4a2b1fa3b45f4aa09b248d53ef07d8e92237f3cc8eb30d6d809698000000000000e1f50500000000")
    // txBytes.set(publicKey, 11);

    // const txView = new DataView(txBytes.buffer, txBytes.byteOffset, txBytes.byteLength);
    // txView.setBigUint64(83, BigInt(txFeeNQT));

    // Generate-TX operation
    // const tx = SendMoneyTx.from({ amount: 1, fee: 1 });
    const tx = new SendMoneyTx();
    tx.senderPublicKey = publicKey;
    tx.recipientPublicKey = addressToPublicKey(
      "RmKSf9_h-v1jW59kOsyfhoIVBKLXGOv91E9lgMIx25vh"
    );
    tx.amount = 1;
    tx.fee = 1;
    tx.timestamp = Date.now() / 1000;
    const txBytes = tx.toBytes();
    console.log("unsignedTxBytes:", byteArrayToHex(txBytes));

    // Sign-TX operation
    const signature = this.sign.detached(txBytes, secretKey);
    console.log("txSignature:", byteArrayToHex(signature));
    txBytes.set(signature, 123);
    console.log("signedTxBytes:", byteArrayToHex(txBytes));

    const resolveTx = await this.grpcService.postTransaction(txBytes);
    console.log("resolveTx:", resolveTx);
  }
}
