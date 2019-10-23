import { Injectable, Inject } from "@angular/core";
import { publicKeyToAddress } from "src/app/Helpers/converters";
import { Storage } from "@ionic/storage";

import { environment } from "src/environments/environment";
import { KeyringService } from "./keyring.service";
import { Account } from "../Interfaces/account";
import {
  GetAccountBalanceRequest,
  GetAccountBalanceResponse
} from "externals/grpc/model/accountBalance_pb";
import { AccountBalanceServiceClient } from "externals/grpc/service/accountBalanceServiceClientPb";
import { GetAddressFromPublicKey } from "src/app/Helpers/utils";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AccountService {
  constructor(
    @Inject("nacl.sign") private sign: any,
    private storage: Storage,
    private keyringSrv: KeyringService
  ) {}

  private _masterSeed: string = "";

  public activeAccountSubject: Subject<any> = new Subject<any>();

  async rawData() {
    return await this.storage.get("ACCOUNTS");
  }

  //async getAll(): Promise<Account[]> {
  async getAll() {
    const accounts = await this.rawData();

    const acountPromises = accounts.map(async acc => {
      const { name, address, path } = acc;

      const balanceObj: any = await this.getAccountBalance(address);
      const balance = balanceObj.accountbalance.balance;

      return {
        name,
        address,
        balance,
        path
      };
    });

    return Promise.all(acountPromises);
  }

  get masterSeed(): string {
    return this._masterSeed;
  }

  set masterSeed(value: string) {
    this._masterSeed = value;
  }

  async getActiveAccount(): Promise<any> {
    const active_account = await this.storage.get("ACTIVE_ACCOUNT");
    const { name, balance = 0, address } = active_account;

    return {
      name,
      balance,
      address
    };
  }

  async setActiveAccount(account: Account) {
    await this.storage.set("ACTIVE_ACCOUNT", account);

    this.activeAccountSubject.next(account);

    return account;
  }

  async getAccountBalance(address: string) {
    const client = new AccountBalanceServiceClient(environment.grpcUrl, null);
    return new Promise((resolve, reject) => {
      const request = new GetAccountBalanceRequest();
      request.setAccountaddress(address);

      client.getAccountBalance(
        request,
        null,
        (err, response: GetAccountBalanceResponse) => {
          if (err) {
            if (err.code == 5) {
              //account not found
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

  async setRootKey(passphrase) {
    const coinCode = environment.coinCode;
    const pass = "p4ssphr4se";

    const { seed } = this.keyringSrv.calcBip32RootKeyFromMnemonic(
      coinCode,
      passphrase,
      pass
    );

    return seed;
  }

  async insert(name: string): Promise<any> {
    const accounts = await this.rawData();

    const coinCode = environment.coinCode;

    const account = {
      name,
      path: null,
      address: null
    };

    for (let i = 0; i < 20; i++) {
      if (
        accounts &&
        accounts.findIndex(acc => {
          return parseInt(acc.path) === i;
        }) < 0
      ) {
        account.path = i;
        break;
      } else {
        account.path = 0;
      }
    }

    const masterSeed = Buffer.from(this.masterSeed, "hex");

    this.keyringSrv.calcBip32RootKeyFromSeed(coinCode, masterSeed);

    const childSeed = this.keyringSrv.calcForDerivationPathForCoin(
      coinCode,
      account.path
    );

    account.address = GetAddressFromPublicKey(childSeed.publicKey);

    let accountsInsert = [account];
    if (accounts) {
      accountsInsert = [...accounts, account];
    }

    await this.storage.set("ACCOUNTS", accountsInsert);

    return account;
  }

  async update(address, name: string): Promise<any> {
    const accounts = await this.rawData();

    const index = accounts.findIndex(acc => {
      return acc.address == address;
    });

    accounts[index].name = name;

    this.storage.set("ACCOUNTS", accounts);

    return accounts[index];
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

  async getAddressName(address: string) {
    const addresses: any = await this.getAll();

    if (addresses === null) return "";

    const index = addresses.findIndex((addr: Account) => {
      return addr.address === address;
    });

    if (index >= 0) {
      return addresses[index].name;
    } else {
      return "";
    }
  }
}
