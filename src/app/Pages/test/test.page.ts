import { Component, Inject, OnInit } from "@angular/core";
import { KeyringService } from "../../Services/keyring.service";
// import * as bip32 from 'bip32'

import {
  byteArrayToHex,
  publicKeyToAddress,
  addressToPublicKey
} from "../../Helpers/converters";
//import { SendMoneyTx } from "../../../Helpers/serializers";

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
    @Inject("nacl.sign") private sign: any
  ) {}

  ngOnInit() {
    console.log("bip44 coinName:", coinName);
  }


  async testService() {
    console.log('testService clicked');
  }

}
