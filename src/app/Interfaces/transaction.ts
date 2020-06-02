export interface Transaction {
  id: string;
  address: string;
  timestamp?: number;
  fee: number;
  type: string;
  amount: number;
  blockId: string;
  height: number;
  transactionIndex?: number;
  sender?: string;
  recipient?: string;
  total?: number;
  name?: string;
  shortaddress?: string;
}

