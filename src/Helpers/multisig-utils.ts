// tslint:disable-next-line:max-line-length
import { createEscrowApprovalForm, escrowApprovalMap } from 'src/app/Components/transactions/form-escrow-approval/form-escrow-approval.component';
// tslint:disable-next-line:max-line-length
import { createRemoveDatasetForm, createRemoveSetupDatasetBytes, removeDatasetMap } from 'src/app/Components/transactions/form-remove-account-dataset/form-remove-account-dataset.component';
import { createSendMoneyForm, sendMoneyMap } from 'src/app/Components/transactions/form-send-money/form-send-money.component';
// tslint:disable-next-line:max-line-length
import { createSetupDatasetBytes, createSetupDatasetForm, setupDatasetMap } from 'src/app/Components/transactions/form-setup-account-dataset/form-setup-account-dataset.component';
import { EscrowApprovalInterface, escrowBuilder, sendMoneyBuilder, SendMoneyInterface, TransactionType } from 'zoobc-sdk';

export function createInnerTxBytes(form: any, txType: number): Buffer {
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return createSendMoneyBytes(form);
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return createSetupDatasetBytes(form);
    case TransactionType.REMOVEACCOUNTDATASETTRANSACTION:
      return createRemoveSetupDatasetBytes(form);
    case TransactionType.APPROVALESCROWTRANSACTION:
      return createEscrowApprovalBytes(form);
  }
}

export function createSendMoneyBytes(form: any): Buffer {
  const { sender, fee, amount, recipient } = form;
  const data: SendMoneyInterface = { sender, fee, amount, recipient };
  return sendMoneyBuilder(data);
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

export function getTxType(type: number) {
  switch (type) {
    case TransactionType.SENDMONEYTRANSACTION:
      return 'send money';
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return 'setup account dataset';
    case TransactionType.REMOVEACCOUNTDATASETTRANSACTION:
      return 'remove setup account dataset';
    case TransactionType.APPROVALESCROWTRANSACTION:
      return 'escrow approval';
  }
}

export function createInnerTxForm(txType: number) {
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return createSendMoneyForm();
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return createSetupDatasetForm();
    case TransactionType.REMOVEACCOUNTDATASETTRANSACTION:
      return createRemoveDatasetForm();
    case TransactionType.APPROVALESCROWTRANSACTION:
      return createEscrowApprovalForm();
  }
}

export function getInputMap(txType: number): any {
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return sendMoneyMap;
    case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
      return setupDatasetMap;
    case TransactionType.REMOVEACCOUNTDATASETTRANSACTION:
      return removeDatasetMap;
    case TransactionType.APPROVALESCROWTRANSACTION:
      return escrowApprovalMap;
  }
}

