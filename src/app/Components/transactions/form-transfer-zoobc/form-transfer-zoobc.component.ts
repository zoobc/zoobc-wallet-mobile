// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Contact } from 'src/app/Interfaces/contact';
import { AccountService } from 'src/app/Services/account.service';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { TRANSACTION_MINIMUM_FEE } from 'src/environments/variable.const';
import { SendMoneyInterface, sendMoneyBuilder, calculateMinimumFee } from 'zbc-sdk';
import { escrowMap, escrowForm } from '../form-escrow/form-escrow.component';
import { Account } from 'src/app/Interfaces/account';
import { map, startWith } from 'rxjs/operators';
import { addressValidator, escrowFieldsValidator } from 'src/Helpers/validators';

@Component({
  selector: 'app-form-transfer-zoobc',
  templateUrl: './form-transfer-zoobc.component.html',
  styleUrls: ['./form-transfer-zoobc.component.scss'],
})
export class FormTransferZoobcComponent implements OnInit {
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

  get message() {
    return this.group.get('message');
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

      this.minimumFee = calculateMinimumFee(this.behaviorEscrow.value.timeout, 1);
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
    calculateMinimumFee(this.behaviorEscrow.value.timeout, 1) : TRANSACTION_MINIMUM_FEE;

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
          this.minimumFee = calculateMinimumFee(escrowValues.timeout, 1);

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

export const transferZoobcMap = {
  sender: 'sender',
  recipient: 'recipient',
  alias: 'alias',
  amount: 'amount',
  fee: 'fee',
  ...escrowMap,
};

export function createTransferZoobcForm(): FormGroup {
  return new FormGroup({
    sender: new FormControl('', Validators.required),
    message: new FormControl(''),
    recipient: new FormControl({}, [Validators.required, addressValidator]),
    amount: new FormControl('', [Validators.required, Validators.min(0)]),
    alias: new FormControl('', Validators.required),
    fee: new FormControl(TRANSACTION_MINIMUM_FEE, [Validators.required, Validators.min(TRANSACTION_MINIMUM_FEE)]),
    ...escrowForm()
  });
}

export function createTransferZoobcBytes(form: any): Buffer {
  const { sender, fee, amount, recipient, message } = form;
  const data: SendMoneyInterface = { sender, fee, amount, recipient, message };
  return sendMoneyBuilder(data);
}
