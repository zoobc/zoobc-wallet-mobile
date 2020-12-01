import { EscrowApprovalInterface, escrowBuilder, sendMoneyBuilder, SendMoneyInterface, TransactionType } from 'zoobc-sdk';

export function createInnerTxBytes(form: any, txType: number): Buffer {
  switch (txType) {
    case TransactionType.SENDMONEYTRANSACTION:
      return createSendMoneyBytes(form);
    // case TransactionType.SETUPACCOUNTDATASETTRANSACTION:
    //   return createSetupDatasetBytes(form);
    // case TransactionType.REMOVEACCOUNTDATASETTRANSACTION:
    //   return createRemoveSetupDatasetBytes(form);
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
