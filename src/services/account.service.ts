import { Injectable, Inject } from "@angular/core";
import { publicKeyToAddress } from 'src/helpers/converters';

@Injectable({
  providedIn: "root"
})
export class AccountService {

    constructor(
        @Inject("nacl.sign") private sign: any,
    ) {

    }
    getAccountAddress(account) {
        const { derivationPrivKey: accountSeed } = account
        const { publicKey } = this.sign.keyPair.fromSeed(accountSeed)
        return publicKeyToAddress(publicKey)
    }
  
}
