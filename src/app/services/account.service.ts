import { Injectable, Inject } from "@angular/core";
import { publicKeyToAddress } from "src/helpers/converters";

@Injectable({
  providedIn: "root"
})
export class AccountService {
  constructor(@Inject("nacl.sign") private sign: any) {}

  getAccountAddress(account) {
    console.log('================account.accountProps:', account.accountProps)
    const publicKey = this.getAccountPublicKey(account.accountProps);
    return publicKeyToAddress(publicKey);
  }

  getAccountPublicKey(account) {
    
    const { derivationPrivKey: accountSeed } = account;
    console.log(new Uint8Array(accountSeed));
    
    const { publicKey } = this.sign.keyPair.fromSeed(new Uint8Array(accountSeed));
    return publicKey;
  }
}
