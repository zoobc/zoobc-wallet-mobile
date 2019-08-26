import { default as JSBI } from 'jsbi';

import { dataViewSetBigUint64 } from './converters';

const BigInt = JSBI.BigInt

const TX_TEMPLATES = {
  "sendMoney" : [0,1,1,225,217,1,0,60,0,0,0,157,100,181,77,94,255,208,17,9,95,54,97,111,213,162,252,31,195,106,89,187,189,33,99,54,62,15,98,177,235,172,238,53,228,6,41,106,120,241,180,5,188,0,192,177,125,33,241,252,223,225,24,29,133,124,214,172,146,164,162,67,23,204,224,213,78,0,0,0,0,0,0,191,47,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,235,91,34,231,240,116,163,104,100,178,95,155,232,156,43,34,172,200,50,190,109,240,242,239,33,48,247,117,86,37,254,132,240,165,184,252,137,55,84,181,70,89,141,106,213,21,150,205,214,168,54,160,10,180,105,161,74,135,17,235,210,42,102,1],
};

const TX_SIG_START = 123;
const TX_SIG_END = TX_SIG_START + 64;

const MAX_UINT32 = 2**32 - 1;
const MAX_UINT64 = 184467440737;


export class SendMoneyTx {
  private _amount : number;
  private _fee : number;

  private txBytes = Uint8Array.from(TX_TEMPLATES['sendMoney']);
  private txView = new DataView(this.txBytes.buffer, this.txBytes.byteOffset, this.txBytes.byteLength);

  static from(d: Object): SendMoneyTx {
    return Object.assign(new SendMoneyTx(), d);
  }

  constructor() {
    // Zero the signature
    this.txBytes.fill(0, TX_SIG_START, TX_SIG_END);
  }

  set senderPublicKey(bytes: ArrayBufferView | ArrayLike<number>) {
    const byteLength = ((bytes as ArrayBufferView).byteLength || (bytes as ArrayLike<number>).length);
    if (byteLength !== 32) throw new Error("32-bytes only");
    this.txBytes.set(bytes as ArrayLike<number>, 11);
  }

  get senderPublicKey() {
    return this.txBytes.subarray(11, 11 + 32);
  }

  set recipientPublicKey(bytes: ArrayBufferView | ArrayLike<number>) {
    const byteLength = ((bytes as ArrayBufferView).byteLength || (bytes as ArrayLike<number>).length);
    if (byteLength !== 32) throw new Error("32-bytes only");
    this.txBytes.set(bytes as ArrayLike<number>, 43);
  }

  get recipientPublicKey() {
    return this.txBytes.subarray(43, 43 + 32);
  }

  set amount(value: number) {
    if (+value > MAX_UINT64) throw new Error("8-bytes only");
    const valueNQT = JSBI.multiply(BigInt(+value), BigInt(1e8));
    dataViewSetBigUint64(this.txView, 75, valueNQT, true);
    // console.log("amountNQT", valueNQT.toString(16));
    this._amount = value;
  }

  get amount() {
    return this._amount;
  }

  set fee(value: number) {
    if (+value > MAX_UINT64) throw new Error("8-bytes only");
    const valueNQT = JSBI.multiply(BigInt(+value), BigInt(1e8));
    dataViewSetBigUint64(this.txView, 83, valueNQT, true);
    // console.log("feeNQT", valueNQT.toString(16));
    this._fee = value;
  }

  get fee() {
    return this._fee;
  }

  set timestamp(value: number) {
    if (value > MAX_UINT32) throw new Error("4-bytes only");
    this.txView.setUint32(3, Math.trunc(value), true);
  }

  set deadline(value: number) {
    if (value > MAX_UINT32) throw new Error("4-bytes only");
    this.txView.setUint32(7, Math.trunc(value), true);
  }

  toBytes() : Uint8Array {
    return this.txBytes;
  }

  toView() : DataView {
    return this.txView;
  }
  
}