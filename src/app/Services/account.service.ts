import { Injectable, Inject } from "@angular/core";
import { publicKeyToAddress } from "src/helpers/converters";
import { Storage } from "@ionic/storage";
import { AccountBalanceServiceClient } from "../grpc/service/accountBalanceServiceClientPb";
import {
  GetAccountBalanceResponse,
  GetAccountBalanceRequest
} from "../grpc/model/accountBalance_pb";
import { environment } from "src/environments/environment";
import { KeyringService } from "./keyring.service";

@Injectable({
  providedIn: "root"
})
export class AccountService {
  constructor(
    @Inject("nacl.sign") private sign: any,
    private storage: Storage,
    private keyringSrv: KeyringService
  ) {}

  async rawData() {
    return await this.storage.get("accounts");
  }

  async getAll() {
    const accounts = await this.rawData();

    return accounts.map(acc => {
      const { accountName, created } = acc;
      return {
        accountName,
        address: this.getAccountAddress(acc.accountProps),
        created
      };
    });
  }

  async getBalance(address) {
    const client = new AccountBalanceServiceClient(
      environment.grpcUrl,
      null,
      null
    );
    return new Promise((resolve, reject) => {
      const request = new GetAccountBalanceRequest();
      request.setAccountaddress(address);

      client.getAccountBalance(
        request,
        null,
        (err, response: GetAccountBalanceResponse) => {
          if (err) {
            if (err.code == 2) {
              return resolve({
                accountbalance: {
                  balance: 0,
                  spendablebalance: 0
                }
              });
            } else return reject(err);
          }

          if (err) return reject(err);
          resolve(response.toObject());
        }
      );
    });
  }

  async generateAccount(passphrase) {
    const accounts = await this.storage.get("accounts");
    const coinCode = environment.coinCode;

    const { bip32RootKey } = this.keyringSrv.calcBip32RootKeyFromSeed(
      coinCode,
      passphrase,
      null
    );

    const account = this.keyringSrv.calcForDerivationPathForCoin(
      coinCode,
      accounts.length,
      0,
      bip32RootKey
    );

    return account;
  }

  async insert(name, account) {
    const accounts = await this.rawData();

    const _account = {
      accountName: name,
      accountProps: account,
      created: new Date()
    };

    await this.storage.set("accounts", [...accounts, _account]);

    return {
      accountName: _account.accountName,
      address: this.getAccountAddress(account),
      created: _account.created
    };
  }

  getAccountAddress(accountProps) {
    const publicKey = this.getAccountPublicKey(accountProps);
    return publicKeyToAddress(publicKey);
  }

  getAccountPublicKey(account) {
    const { derivationPrivKey: accountSeed } = account;
    //console.log(new Uint8Array(accountSeed));

    const { publicKey } = this.sign.keyPair.fromSeed(
      new Uint8Array(accountSeed)
    );
    return publicKey;
  }
}
