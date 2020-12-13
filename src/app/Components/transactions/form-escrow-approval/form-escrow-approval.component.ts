import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TRANSACTION_MINIMUM_FEE } from 'src/environments/variable.const';
import { EscrowApprovalInterface, escrowBuilder } from 'zoobc-sdk';
import { escrowMap, escrowForm } from '../form-escrow/form-escrow.component';

@Component({
  selector: 'app-form-escrow-approval',
  templateUrl: './form-escrow-approval.component.html',
  styleUrls: ['./form-escrow-approval.component.scss'],
})
export class FormEscrowApprovalComponent {
  @Input() group: FormGroup;
  @Input() inputMap: any;
  @Input() multisig = false;

  minFee =  TRANSACTION_MINIMUM_FEE;

  constructor() {}
}

export const escrowApprovalMap = {
  fee: 'fee',
  transactionId: 'transactionId',
  sender: 'sender',
  approvalCode: 'approvalCode',
  ...escrowMap,
};

export function createEscrowApprovalForm(): FormGroup {
  return new FormGroup({
    sender: new FormControl('', Validators.required),
    fee: new FormControl(TRANSACTION_MINIMUM_FEE, [Validators.required, Validators.min(TRANSACTION_MINIMUM_FEE)]),
    transactionId: new FormControl('', Validators.required),
    approvalCode: new FormControl(0, Validators.required),
    ...escrowForm(),
  });
}

export function createEscrowApprovalBytes(form: any): Buffer {
  const { approvalCode, fee, transactionId, sender } = form;
  const data: EscrowApprovalInterface = {
    fee,
    approvalCode,
    approvalAddress: sender,
    transactionId,
  };
  return escrowBuilder(data);
}

