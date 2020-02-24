export interface Transaction {
  id: string;
  type: string;
  address: string;
  sender: string;
  recipient: string;
  amount: number;
  height: number;
  blockId: number;
  fee: number;
  total: number;
  timestamp: Date;
}
