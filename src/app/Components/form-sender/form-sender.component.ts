import {
  Component,
  forwardRef,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { Account, AccountType } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
import { PopoverAccountComponent } from 'src/app/Components/popover-account/popover-account.component';
import zoobc, { AccountBalance, Address } from 'zbc-sdk';

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
  ],
  encapsulation: ViewEncapsulation.None
})
export class FormSenderComponent implements OnInit, ControlValueAccessor {
  public account: Account;
  @Input() accountType: AccountType;
  @Input() canSwitch = 'yes';
  @Input() switchToActive = 'yes';
  @Input() predefList = [];
  disabled = false;

  onChange = (value: Account) => { };
  onTouched = () => { };


  constructor(
    private popoverCtrl: PopoverController,
    private accountSrv: AccountService
  ) { }

  async ngOnInit() {

    if (this.predefList.length < 1) {
      this.account = await this.accountSrv.getCurrAccount();
      this.getBalanceByAddress(this.account.address);
    }

  }

  async switchAccount(ev: any) {
    if (this.canSwitch === 'no') {
      return;
    }

    const popover = await this.popoverCtrl.create({
      component: PopoverAccountComponent,
      event: ev,
      cssClass: 'popover-account',
      componentProps: {
        accountType: this.accountType,
        predefList: this.predefList
      },
      translucent: true
    });

    popover.onWillDismiss().then(async ({ data }: { data: Account }) => {
      if (data) {
        this.account = data;

        if (this.switchToActive === 'yes') {
          this.accountSrv.switchAccount(data);
        }

        this.getBalanceByAddress(data.address);
        this.onChange(data);
      }
    });

    return popover.present();
  }

  private getBalanceByAddress(address: Address) {

    zoobc.Account.getBalance(address)
      .then((data: AccountBalance) => {
        console.log('=== Account Balance: ', data);
        this.account.balance = Number(data.spendableBalance);
      })
      .catch(error => { })
      .finally(() => { });
  }



  writeValue(value: Account) {
    this.account = value;
  }

  registerOnChange(fn: (value: Account) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  // Allow the Angular form control to disable this input
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}
