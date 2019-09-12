export interface Transaction {
  id: string;
  type: string;
  sender: string;
  recipient: string;
  amount: number;
  fee: number;
  total: number;
  transactionDate: Date;
}
