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
import { Account } from "../Interfaces/account";

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

  //async getAll(): Promise<Account[]> {
  async getAll() {
    const accounts = await this.rawData();

    const acountPromises = accounts.map(async acc => {
      const { name, created } = acc;
      const address = this.getAccountAddress(acc.accountProps);
      const accountProps = acc.accountProps;
      const balanceObj: any = await this.getAccountBalance(address);
      const balance = balanceObj.accountbalance.balance;

      return {
        name,
        address,
        balance,
        accountProps,
        created
      };
    });

    return Promise.all(acountPromises);
  }

  async getActiveAccount(): Promise<Account> {
    const active_account = await this.storage.get("active_account");
    const { name, balance, address, accountProps, created } = active_account;

    return {
      name,
      balance,
      address,
      accountProps,
      created
    };
  }

  async setActiveAccount(account: Account) {
    await this.storage.set("active_account", account);
    return account;
  }

  async getAccountBalance(address: string) {
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
      accounts ? accounts.length : 0,
      0,
      bip32RootKey
    );

    return account;
  }

  async insert(name: string, accountProps: any): Promise<Account> {
    const accounts = await this.rawData();

    const account = {
      name,
      accountProps,
      created: new Date()
    };

    let accountsInsert = [account];
    if (accounts) {
      accountsInsert = [...accounts, account];
    }

    await this.storage.set("accounts", accountsInsert);

    const address = this.getAccountAddress(accountProps);
    const _balance: any = await this.getAccountBalance(address);

    return {
      name: account.name,
      address,
      balance: _balance.accountbalance.balance,
      accountProps,
      created: account.created
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
