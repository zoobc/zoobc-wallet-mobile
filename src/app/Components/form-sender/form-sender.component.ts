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
  @Input() showBalance = 'yes';
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
      console.log('this.predefList length<1: ', this.predefList.length);
      this.account = await this.accountSrv.getCurrAccount();
    } else {
      console.log('this.predefList length>0: ', this.predefList.length);
      this.account = undefined;
    }
    console.log(' == this.account: ', this.account);
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
        predefList: this.predefList,
        showBalance: this.showBalance
      },
      translucent: true
    });

    popover.onWillDismiss().then(async ({ data }: { data: Account }) => {
      if (data) {
        this.account = data;
        if (this.switchToActive === 'yes') {
          this.accountSrv.switchAccount(data);
        }
        this.onChange(data);
      }
    });

    return popover.present();
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
