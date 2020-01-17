export interface Transaction {
  id: string;
  blockId?: string;
  type: string;
  address: string;
  sender: string;
  senderName?: string;
  recipient: string;
  amount: number;
  fee: number;
  total: number;
  timestamp: Date;
}
