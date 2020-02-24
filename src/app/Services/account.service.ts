import { Injectable, Inject } from '@angular/core';
import { Storage } from '@ionic/storage';
import { STORAGE_ALL_ACCOUNTS, STORAGE_CURRENT_ACCOUNT } from 'src/environments/variable.const';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(@Inject('nacl.sign') private sign: any, private storage: Storage) { }

  async getAll() {
    const accounts = await this.storage.get(STORAGE_ALL_ACCOUNTS).catch(error => {
      console.log(error);
    });
    return accounts;
  }

  async setActiveAccount(account) {
    this.storage.set(STORAGE_CURRENT_ACCOUNT, account).catch(error => {
      console.log('== Error when set active account: ', error);
    });
  }

  async getActiveAccount() {
    return await this.storage.get(STORAGE_CURRENT_ACCOUNT);
  }

  async updateNameByIndex(name: string, idx: number) {
    const accounts = await this.getAll();
    const acc = accounts[idx];
    accounts[idx] = { ...acc, accountName: name };
    await this.update(accounts);

    // if edited is active account then update active account
    const acctiveAcc = await this.getActiveAccount();
    // const updateAddress = this.getAccountAddress(acc);
    // const activeAddress = this.getAccountAddress(acctiveAcc);
    // if (String(updateAddress).valueOf() === String(activeAddress).valueOf()) {
    //   this.setActiveAccount(accounts[idx]);
    // }
  }

  async update(accounts: any) {
    await this.storage.set(STORAGE_ALL_ACCOUNTS, accounts).catch((error: any) => {
      console.log(error);
    });
  }


}
