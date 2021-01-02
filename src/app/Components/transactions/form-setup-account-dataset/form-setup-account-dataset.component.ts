import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TRANSACTION_MINIMUM_FEE } from 'src/environments/variable.const';
import { SetupDatasetInterface, setupDatasetBuilder } from 'zbc-sdk';
import { escrowMap, escrowForm } from '../form-escrow/form-escrow.component';

@Component({
  selector: 'app-form-setup-account-dataset',
  templateUrl: './form-setup-account-dataset.component.html',
  styleUrls: ['./form-setup-account-dataset.component.scss'],
})
export class FormSetupAccountDatasetComponent implements OnInit {

  @Input() group: FormGroup;
  @Input() inputMap: any;
  @Input() multisig = false;
  minFee = TRANSACTION_MINIMUM_FEE;
  isSetupOther = false;

  constructor() {}

  ngOnInit() {
    this.setDefaultRecipient();
  }

  onToggleEnableSetupOther() {
    this.isSetupOther = !this.isSetupOther;
    if (!this.isSetupOther) { this.setDefaultRecipient(); }
  }

  setDefaultRecipient() {
    const sender = this.group.get('sender').value;
    const recipientField = this.group.get('recipientAddress');
    recipientField.patchValue(sender);
  }
}

export const setupDatasetMap = {
  sender: 'sender',
  property: 'property',
  value: 'value',
  recipientAddress: 'recipientAddress',
  fee: 'fee',
  ...escrowMap,
};

export function createSetupDatasetForm(): FormGroup {
  return new FormGroup({
    sender: new FormControl('', Validators.required),
    property: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required]),
    recipientAddress: new FormControl('', Validators.required),
    fee: new FormControl(TRANSACTION_MINIMUM_FEE, [Validators.required, Validators.min(TRANSACTION_MINIMUM_FEE)]),
    ...escrowForm(),
  });
}

export function createSetupDatasetBytes(form: any): Buffer {
  const { sender, fee, recipientAddress, property, value } = form;
  const data: SetupDatasetInterface = {
    property,
    value,
    setterAccountAddress: sender,
    recipientAccountAddress: recipientAddress,
    fee,
  };
  console.log('=== data createSetupDatasetBytes: ', data);

  return setupDatasetBuilder(data);
}
