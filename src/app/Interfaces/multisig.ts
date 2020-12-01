import { MultiSigInterface } from 'zoobc-sdk';
export interface MultiSigDraft extends MultiSigInterface {
    id: number;
    generatedSender?: string;
    txType: number;
    txBody?: any;
}
