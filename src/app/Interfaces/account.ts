import { Address } from 'zbc-sdk';

export type AccountType = 'normal' | 'multisig' | 'one time login' | 'imported' | 'hardware' | 'address';
export interface Account {
  name: string;
  path?: number;
  type: AccountType;
  nodeIP?: string;
  address: Address;
  participants?: Address[];
  nonce?: number;
  minSig?: number;
  balance?: number;
}

