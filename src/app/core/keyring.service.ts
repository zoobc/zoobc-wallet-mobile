import { Injectable, Inject } from "@angular/core";

import { MnemonicsService } from "./mnemonics.service";
import { APP_CONFIG, AppConfig } from "../app-config.module";

export function hasStrongRandom() {
  return "crypto" in window && window["crypto"] !== null;
}

export function uint8ArrayToHex(a) {
  let s = "";
  for (let i = 0; i < a.length; i++) {
    let h = a[i].toString(16);
    while (h.length < 2) {
      h = "0" + h;
    }
    s = s + h;
  }
  return s;
}

@Injectable({
  providedIn: "root"
})
export class KeyringService {
  constructor(
    private mnemonicsService: MnemonicsService,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {}

  generateRandomPhrase(numWords = this.config.mnemonicNumWords): { [key: string]: string } {
    if (!hasStrongRandom()) {
      const errorText = "This browser does not support strong randomness";
      throw new Error(errorText);
    }
    // get the amount of entropy to use
    const strength = (numWords / 3) * 32;
    const buffer = new Uint8Array(strength / 8);
    // create secure entropy
    const data = crypto.getRandomValues(buffer);
    // show the words
    const words = this.mnemonicsService.mnemonic.toMnemonic(data);
    // DOM.phrase.val(words);
    // show the entropy
    const entropyHex = uint8ArrayToHex(data);
    // DOM.entropy.val(entropyHex);
    // ensure entropy fields are consistent with what is being displayed
    // DOM.entropyMnemonicLength.val("raw");
    return {
      phrase: words,
      entropy: entropyHex,
      entropyMnemonicLength: "raw"
    };
  }
}
