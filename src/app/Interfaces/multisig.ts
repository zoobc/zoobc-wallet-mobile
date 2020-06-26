import { MultiSigInterface, SendMoneyInterface } from 'zoobc-sdk';

export interface MultiSigDraft extends MultiSigInterface {
    id: number;
    generatedSender?: string;
    transaction?: SendMoneyInterface;
}
