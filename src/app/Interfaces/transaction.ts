export interface Transaction {
  id: string;
  type: string;
  address: string;
  sender: string;
  recipient: string;
  amount: number;
  fee: number;
  total: number;
  timestamp: Date;
}
