import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { Account } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
import { PopoverAccountComponent } from 'src/app/Shared/component/popover-account/popover-account.component';
import zoobc from 'zoobc-sdk';

@Component({
  selector: 'app-form-sender',
  templateUrl: './form-sender.component.html',
  styleUrls: ['./form-sender.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSenderComponent),
      multi: true
    }
  ]
})
export class FormSenderComponent implements OnInit, ControlValueAccessor {
  constructor(
    private popoverCtrl: PopoverController,
    private accountSrv: AccountService
  ) {}

  public account: Account;

  async ngOnInit() {
    this.account = await this.accountSrv.getCurrAccount();
    this.getBalanceByAddress(this.account.address);
  }

  async switchAccount(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopoverAccountComponent,
      event: ev,
      cssClass: 'popover-account',
      translucent: true
    });

    popover.onWillDismiss().then(async ({ data }: { data: Account }) => {
      if (data) {
        this.account = data;
        this.accountSrv.setActiveAccount(data);
        this.getBalanceByAddress(data.address);
        this.onChange(data);
      }
    });

    return popover.present();
  }

  private async getBalanceByAddress(address: string) {
    await zoobc.Account.getBalance(address)
      .then(data => {
        this.account.balance = Number(data.accountbalance.balance);
      })
      .catch(error => {})
      .finally(() => {});
  }

  onChange = (value: Account) => {};

  onTouched = () => {};

  writeValue(value: Account) {
    this.account = value;
  }

  registerOnChange(fn: (value: Account) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
}
