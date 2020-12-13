import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Account } from 'src/app/Interfaces/account';
import { Contact } from 'src/app/Interfaces/contact';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { QrScannerService } from 'src/app/Services/qr-scanner.service';
import { PopoverAccountComponent } from 'src/app/Components/popover-account/popover-account.component';
import { PopoverOptionComponent } from 'src/app/Components/popover-option/popover-option.component';

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
export class FormGetAddressComponent implements OnInit, OnDestroy, ControlValueAccessor {
  constructor(
    private router: Router,
    private popoverCtrl: PopoverController,
    private qrScannerSrv: QrScannerService,
    private addressBookSrv: AddressBookService,
    private translateSrv: TranslateService
  ) {}

  @Input() identity: string;

  private textContacts: string;
  private textAccounts: string;
  private textNewAddress: string;

  qrScannerSubscription: any;
  addressSubscription: any;

  public buttonTitle: string;
  public address: Contact;
  public textAddress: string;
  public isNewAddress: boolean;

  ngOnInit() {
    this.isNewAddress = true;

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

    this.translateSrv.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateLang();
    });

    this.translateLang();
  }

  translateLang() {
    this.translateSrv.get([
      'contacts',
      'my accounts',
      'new address'
  ]).subscribe((res: any) => {
      this.textContacts = res.contacts;
      this.textAccounts = res['my accounts'];
      this.textNewAddress = res['new address'];
      this.buttonTitle = this.textNewAddress;
    });
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
    // this.scanForWhat = arg;
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
            label: this.textContacts
          },
          {
            key: 'my-account',
            label: this.textAccounts
          },
          {
            key: 'new-address',
            label: this.textNewAddress
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
          this.buttonTitle = this.textNewAddress;
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
