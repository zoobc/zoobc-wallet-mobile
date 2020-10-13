export enum AccountType {
  NORMAL = 'normal',
  MULTISIG = 'multisig'
}

export interface Account {
  path: number;
  name: string;
  nodeIP: string;
  address: string;
  balance?: number;
  lastTx?: number;
  type?: 'normal' | 'multisig';
  participants?: string[];
  nonce?: number;
  minSig?: number;
  signByAddress?: string;
}
