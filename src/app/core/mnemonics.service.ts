import { Injectable, Inject } from "@angular/core";

import { APP_CONFIG, AppConfig } from "../app-config.module";

@Injectable({
  providedIn: "root"
})
export class MnemonicsService {
  private Mnemonic : (language: string) => void

  public mnemonic : any
  public mnemonics = new Map<string, any>()

  constructor(
    @Inject("global") private global: any,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.Mnemonic = global.Mnemonic;
    const language = config.mnemonicLanguage;

    const Mnemonic = this.Mnemonic;
    this.mnemonic = new Mnemonic(language);
    this.mnemonics.set(language, this.mnemonic)
  }

  setMnemonicLanguage(language: string) {
    // Load the bip39 mnemonic generator for this language if required
    if (!this.mnemonics.has(language)) {
      const Mnemonic = this.Mnemonic;
      this.mnemonics.set(language, new Mnemonic(language));
    }
    this.mnemonic = this.mnemonics.get(language)
  }
}
