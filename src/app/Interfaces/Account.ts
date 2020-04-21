export interface Account {
    path: number;
    name: string;
    nodeIP: string;
    address: string;
    shortAddress: string;
    created: Date;
    balance?: number;
    lastTx?: number;
}