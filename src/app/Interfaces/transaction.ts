export interface Transaction {
  id: string;
  blockId?: string;
  type: string;
  sender: string;
  senderName?: string;
  recipient: string;
  recipientName?: string;
  amount: any;
  fee: number;
  transactionDate: Date;
}
