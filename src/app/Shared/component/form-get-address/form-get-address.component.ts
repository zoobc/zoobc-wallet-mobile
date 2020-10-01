import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Account } from 'src/app/Interfaces/account';
import { Contact } from 'src/app/Interfaces/contact';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { QrScannerService } from 'src/app/Services/qr-scanner.service';
import { PopoverAccountComponent } from 'src/app/Shared/component/popover-account/popover-account.component';
import { PopoverOptionComponent } from 'src/app/Shared/component/popover-option/popover-option.component';

@Component({
  selector: 'app-form-get-address',
  templateUrl: './form-get-address.component.html',
  styleUrls: ['./form-get-address.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormGetAddressComponent),
      multi: true
    }
  ]
})
export class FormGetAddressComponent implements OnInit, ControlValueAccessor {
  constructor(
    private router: Router,
    private popoverCtrl: PopoverController,
    private qrScannerSrv: QrScannerService,
    private addressBookSrv: AddressBookService
  ) {}

  @Input() identity: string;

  qrScannerSubscription: any;
  addressSubscription: any;

  public buttonTitle: string;
  public address: Contact;
  public textAddress: string;
  public isNewAddress: boolean;

  ngOnInit() {
    this.isNewAddress = true;
    this.buttonTitle = 'new address';

    this.addressSubscription = this.addressBookSrv.addressSubject.subscribe(
      ({ identity, address }: any) => {
        if (identity === this.identity) {
          this.textAddress = address.address;
          this.buttonTitle = address.name;
          this.isNewAddress = false;
          this.onChange(address);
        }
      }
    );

    this.qrScannerSubscription = this.qrScannerSrv.qrScannerSubject.subscribe(
      str => {
        const results = str.split('||');
      }
    );
  }

  ngOnDestroy() {
    if (this.addressSubscription) {
      this.addressSubscription.unsubscribe();
    }

    if (this.qrScannerSubscription) {
      this.qrScannerSubscription.unsubscribe();
    }
  }

  openListAccount(arg: string) {
    const navigationExtras: NavigationExtras = {
      state: {
        forWhat: arg
      }
    };
    this.router.navigate(['list-account'], navigationExtras);
  }

  goToScan(arg: string) {
    //this.scanForWhat = arg;
    this.router.navigateByUrl('/qr-scanner');
  }

  changeTextAddress() {
    if (this.isNewAddress) {
      this.onChange({ name: '', address: this.textAddress });
    }
  }

  async showAccount(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopoverAccountComponent,
      event: ev,
      cssClass: 'popover-account',
      translucent: true
    });

    popover.onWillDismiss().then(async ({ data }: { data: Account }) => {
      if (data) {
        this.textAddress = data.address;
        this.buttonTitle = data.name;
        this.isNewAddress = false;
        this.onChange({
          name: data.name,
          address: data.address
        });
      }
    });

    return popover.present();
  }

  async showOption(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopoverOptionComponent,
      componentProps: {
        options: [
          {
            key: 'contact',
            label: 'contacts'
          },
          {
            key: 'my-account',
            label: 'my accounts'
          },
          {
            key: 'new-address',
            label: 'new address'
          }
        ]
      },
      event: ev,
      translucent: true
    });

    popover.onWillDismiss().then(({ data }) => {
      switch (data) {
        case 'contact':
          const extras: NavigationExtras = {
            state: {
              forWhat: this.identity
            }
          };
          this.router.navigate(['/address-book'], extras);
          break;
        case 'my-account':
          this.showAccount(ev);
          break;
        case 'new-address':
          this.buttonTitle = 'new address';
          this.isNewAddress = true;
          this.textAddress = '';
          this.onChange({
            name: '',
            address: ''
          });
          break;
      }
    });

    return popover.present();
  }

  onChange = (value: Contact) => {};

  onTouched = () => {};

  writeValue(value: Contact) {
    this.address = value;
  }

  registerOnChange(fn: (value: Contact) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
}
