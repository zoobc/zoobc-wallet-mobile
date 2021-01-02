import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Contact } from 'src/app/Interfaces/contact';
import { AccountService } from 'src/app/Services/account.service';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { TRANSACTION_MINIMUM_FEE } from 'src/environments/variable.const';
import { SendMoneyInterface, sendMoneyBuilder } from 'zbc-sdk';
import { escrowMap, escrowForm } from '../form-escrow/form-escrow.component';
import { Account } from 'src/app/Interfaces/account';
import { map, startWith } from 'rxjs/operators';
import { addressValidator, escrowFieldsValidator } from 'src/Helpers/validators';
import { calculateMinFee } from 'src/Helpers/utils';

@Component({
  selector: 'app-form-send-money',
  templateUrl: './form-send-money.component.html',
  styleUrls: ['./form-send-money.component.scss'],
})
export class FormSendMoneyComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() inputMap: any;
  @Input() multisig = false;

  // additional
  submitted = false;
  withEscrow = false;
  private minimumFee = TRANSACTION_MINIMUM_FEE;
  // end off

  showSaveAddressBtn = true;
  saveAddress = false;
  contacts: Contact[];
  contact: Contact;
  filteredContacts: Observable<Contact[]>;
  minFee = TRANSACTION_MINIMUM_FEE;
  account: Account;
  accounts: Account[];
  behaviorEscrowChangesSubscription: any;

  constructor(private accountServ: AccountService,
              private addressBookServ: AddressBookService) {
  }

  async ngOnInit() {
    this.group.get('alias').disable();
    const recipientForm = this.group.get('recipient');
    this.contacts = await this.addressBookServ.getAll() || [];
    this.filteredContacts = recipientForm.valueChanges.pipe(
      startWith(''),
      map(value => this.filterContacts(value))
    );
    this.getAccounts();
    if (recipientForm.value) { this.isAddressInContacts(); }
  }

  get sender() {
    return this.group.get('sender');
  }

  get recipient() {
    return this.group.get('recipient');
  }

  get amount() {
    return this.group.get('amount');
  }

  get fee() {
    return this.group.get('fee');
  }

  get behaviorEscrow() {
    return this.group.get('behaviorEscrow');
  }

  changeWithEscrow(value: boolean) {
    this.withEscrow = value;

    if (value) {
      this.group.addControl(
        'behaviorEscrow',
        new FormControl({}, [escrowFieldsValidator])
      );

      this.minimumFee = calculateMinFee(this.behaviorEscrow.value.timeout);
      this.setBehaviorEscrowChanges();
    } else {
      this.group.removeControl('behaviorEscrow');
      this.minimumFee = TRANSACTION_MINIMUM_FEE;
      if (this.behaviorEscrowChangesSubscription) {
        this.behaviorEscrowChangesSubscription.unsubscribe();
      }
    }

    this.setFeeValidation();
    this.setAmountValidation();
  }

  onBehaviorEscrowChange() {
    this.minimumFee = this.behaviorEscrow.value && this.behaviorEscrow.value.timeout ?
      calculateMinFee(this.behaviorEscrow.value.timeout) : TRANSACTION_MINIMUM_FEE;

    this.setFeeValidation();
    this.setAmountValidation();
  }

  setBehaviorEscrowChanges() {
    this.behaviorEscrowChangesSubscription = this.behaviorEscrow.valueChanges.subscribe(
      escrowValues => {
        if (escrowValues.commission) {
          this.setAmountValidation();
        }

        if (escrowValues.timeout) {
          this.minimumFee = calculateMinFee(escrowValues.timeout.value);

          this.setFeeValidation();
          this.setAmountValidation();
        }
      }
    );
  }

  setFeeValidation() {
    this.fee.setValidators([
      Validators.required,
      Validators.min(this.minimumFee)
    ]);
    this.fee.updateValueAndValidity();
  }


  setAmountValidation() {
    this.amount.setValidators([
      Validators.required,
      Validators.min(0.00000001),
      Validators.max(
        this.sender.value.balance -
          (this.minimumFee > this.fee.value
            ? this.minimumFee
            : this.fee.value) -

          this.behaviorEscrow.value.commission
      )
    ]);

    this.amount.updateValueAndValidity();
  }

  async getAccounts() {
    this.accounts = await this.accountServ.allAccount();
    this.accounts.forEach(account => {
      const contact: Contact = {
        address: account.address.value,
        name: account.name,
      };
      this.contacts.push(contact);
    });
  }

  onSwitchAccount(account: Account) {
    this.account = account;
    this.group.get('sender').patchValue(account.address);
  }

  filterContacts(value: string): Contact[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.contacts.filter((contact: Contact) => contact.name.toLowerCase().includes(filterValue));
    } else if (value === '') { return this.contacts; }
  }

  isAddressInContacts() {
    console.log('== isAddressInContacts');
    const aliasField = this.group.get('alias');

    const recipientForm = this.group.get('recipient');

    const isAddressInContacts = this.contacts.some(c => {
      if (c.address === recipientForm.value) {
        this.contact = c;
        return true;
      } else { return false; }
    });

    if (isAddressInContacts) {
      aliasField.disable();
      this.saveAddress = false;
      this.showSaveAddressBtn = false;
    } else {
      this.showSaveAddressBtn = true;
    }
  }

  toggleSaveAddress() {
    const aliasField = this.group.get('alias');

    if (this.saveAddress) {
      aliasField.disable();
      this.saveAddress = false;
    } else {
      aliasField.enable();
      this.saveAddress = true;
    }
  }
}

export const sendMoneyMap = {
  sender: 'sender',
  recipient: 'recipient',
  alias: 'alias',
  amount: 'amount',
  fee: 'fee',
  ...escrowMap,
};

export function createSendMoneyForm(): FormGroup {
  return new FormGroup({
    sender: new FormControl('', Validators.required),
    // recipient: new FormControl('', Validators.required),
    recipient: new FormControl({}, [Validators.required, addressValidator]),
    amount: new FormControl('', [Validators.required, Validators.min(1 / 1e8)]),
    alias: new FormControl('', Validators.required),
    fee: new FormControl(TRANSACTION_MINIMUM_FEE, [Validators.required, Validators.min(TRANSACTION_MINIMUM_FEE)]),
    ...escrowForm()
  });
}

export function createSendMoneyBytes(form: any): Buffer {
  const { sender, fee, amount, recipient } = form;
  const data: SendMoneyInterface = { sender, fee, amount, recipient };
  return sendMoneyBuilder(data);
}
