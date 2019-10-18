import { Injectable, Inject } from '@angular/core';
import { publicKeyToAddress } from 'src/app/Helpers/converters';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  ACCOUNT_STORAGE = 'accounts';
  ACTIVE_ACCOUNT = 'active_account';

  constructor(@Inject('nacl.sign') private sign: any, private storage: Storage) { }

  async getAll() {
    const accounts = await this.storage.get(this.ACCOUNT_STORAGE).catch(error => {
      console.log(error);
    });
    return accounts;
  }

  getAccountAddress(account) {
    const publicKey = this.getAccountPublicKey(account.accountProps);
    return publicKeyToAddress(publicKey);
  }

  async setActiveAccount(account) {
    this.storage.set(this.ACTIVE_ACCOUNT, account).catch(error => {
      console.log('== Error when set active account: ', error);
    });
  }

  async getActiveAccount() {
    return await this.storage.get(this.ACTIVE_ACCOUNT);
  }

  async updateNameByIndex(name: string, idx: number) {
    const accounts = await this.getAll();
    const acc = accounts[idx];
    accounts[idx] = { ...acc, accountName: name };
    await this.update(accounts);

    // if edited is active account then update active account
    const acctiveAcc = await this.getActiveAccount();
    const updateAddress = this.getAccountAddress(acc);
    const activeAddress = this.getAccountAddress(acctiveAcc);
    if (String(updateAddress).valueOf() === String(activeAddress).valueOf()) {
      this.setActiveAccount(accounts[idx]);
    }
  }

  async update(accounts: any) {
    await this.storage.set(this.ACCOUNT_STORAGE, accounts).catch((error: any) => {
      console.log(error);
    });
  }

  getAccountPublicKey(account) {

    const { derivationPrivKey: accountSeed } = account;
    console.log(new Uint8Array(accountSeed));

    const { publicKey } = this.sign.keyPair.fromSeed(new Uint8Array(accountSeed));
    return publicKey;
  }


}
