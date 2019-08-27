export interface Transaction {
  id: string;
  type: string;
  sender: string;
  recipient: string;
  amount: any;
  fee: number;
  transactionDate: Date;
}
