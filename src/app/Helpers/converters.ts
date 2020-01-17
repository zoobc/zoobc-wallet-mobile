import { default as JSBI } from 'jsbi';
import * as BN from 'bn.js';
import CryptoJS from 'crypto-js';

const base58 = require('base58-encode');

const keySiz = 256;
const ivSize = 128;
const iteration = 100;

export function doEncrypt(msg, pass) {
  const salt = CryptoJS.lib.WordArray.random(ivSize / 8);

  const key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySiz / 32,
      iterations: iteration
    });

  const iv1 = CryptoJS.lib.WordArray.random(ivSize / 8);

  const encrypted = CryptoJS.AES.encrypt(msg, key, {
    iv: iv1,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });

  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  const transitmessage = salt.toString() + iv1.toString() + encrypted.toString();
  return transitmessage;
}

export function doDecrypt(transitmessage, pass) {
  const salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
  const iv2 = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32));
  const encrypted = transitmessage.substring(64);

  const key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySiz / 32,
      iterations: iteration
    });

  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv2,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });

  return decrypted;
}


export function hexToByteArray(hexStr: string): Uint8Array {
  return new Uint8Array(
    hexStr.match(/[\da-f]{2}/gi).map(byte => parseInt(byte, 16))
  );
}


export function timeConverter(unixTimestamp: number) {
  const a = new Date(unixTimestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const sec = a.getSeconds();
  const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return time;
}

export function makeShortAddress(addrs: string) {
  if (addrs.length < 21) {
      return addrs;
  }
  return addrs.substring(0, 6).concat('...').concat(addrs.substring(addrs.length - 6, addrs.length));
}


export function base64ToByteArray(base64Str: string): Uint8Array {
  const buf = Buffer.from(base64Str, 'base64');
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}

export function byteArrayToBase64(
  bytes: ArrayBuffer | ArrayBufferView | Array<number>
): string {
  const buf =
    bytes instanceof ArrayBuffer
      ? Buffer.from(bytes)
      : ArrayBuffer.isView(bytes)
      ? Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)
      : Buffer.from(bytes);
  return buf.toString('base64');
}

export function byteArrayToBase58(
  bytes: ArrayBuffer | ArrayBufferView | Array<number>
): string {
  const buf =
    bytes instanceof ArrayBuffer
      ? Buffer.from(bytes)
      : ArrayBuffer.isView(bytes)
      ? Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)
      : Buffer.from(bytes);
  return base58(bytes);
}
export function toBase64Url(base64Str: string): string {
  return base64Str.replace(/\+/g, '-').replace(/\//g, '_');
}

export function mergeByteArrays(
  resultConstructor,
  arrays: Array<ArrayBufferView | number[]>
) {
  const totalLength = arrays.reduce(
    (acc, arr) =>
      ((arr as ArrayBufferView).byteLength || (arr as number[]).length) + acc,
    0
  );
  const result = new resultConstructor(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    const len = (arr as ArrayBufferView).byteLength || (arr as number[]).length;
    result.set(arr, offset);
    offset += len;
  }
  return result;
}

export function publicKeyToAddress(
  hexOrBytes: string | ArrayBuffer | ArrayBufferView | Array<number>
): string {
  const bytes =
    typeof hexOrBytes === 'string'
      ? hexToByteArray(hexOrBytes)
      : hexOrBytes instanceof ArrayBuffer
      ? new Uint8Array(hexOrBytes)
      : ArrayBuffer.isView(hexOrBytes)
      ? hexOrBytes
      : Uint8Array.from(hexOrBytes);

  const addressBytes = mergeByteArrays(Uint8Array, [
    bytes,
    getAddressChecksum(bytes)
  ]);
  return toBase64Url(byteArrayToBase64(addressBytes));
}

export function getAddressChecksum(
  bytes: ArrayBuffer | ArrayBufferView | Array<number>
): Uint8Array {
  const view: DataView =
    bytes instanceof ArrayBuffer
      ? new DataView(bytes)
      : ArrayBuffer.isView(bytes)
      ? new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
      : new DataView(Uint8Array.from(bytes).buffer);
  const n = view.byteLength;
  let a = 0;
  for (let i = 0; i < n; i++) {
    a = (a + view.getUint8(i)) % 256;
  }
  return Uint8Array.from([a]);
}

// // DataView polyfills
function __makeDataViewSetter(funcName, viewFuncName) {
  const viewSetFunc = DataView.prototype[`set${viewFuncName}`];
  if (typeof viewSetFunc === 'undefined') {
    throw Error('Making DataView setter with invalid view function name.');
  }

  const fn = (view, byteOffset, value, littleEndian) => {
    if (value.constructor !== JSBI) {
      throw TypeError('Value needs to be JSBI');
    }

    const signBit = value.sign ? 1 << 31 : 0;
    const lowWord = value.__unsignedDigit(0) - (value.sign ? 1 : 0);
    viewSetFunc.call(
      // DataView.set{Int|Uint}32
      view,
      littleEndian ? byteOffset : 4 + byteOffset,
      lowWord,
      littleEndian
    );
    const highWord =
      (value.__unsignedDigit(1) | signBit) + (value.sign ? 1 : 0);
    viewSetFunc.call(
      // DataView.set{Int|Uint}32
      view,
      littleEndian ? 4 + byteOffset : byteOffset,
      highWord,
      littleEndian
    );
  };
  Object.defineProperty(fn, 'name', { value: funcName });
  return fn;
}

function __makeDataViewGetter(funcName, viewFuncName) {
  const viewGetFunc = DataView.prototype[`get${viewFuncName}`];
  if (typeof viewGetFunc === 'undefined') {
    throw Error('Making DataView getter with invalid view function name.');
  }

  const fn = (view, byteOffset, littleEndian) => {
    // Get 64 bit number as two 32 bit numbers.
    // The lower/higher (depending on endianess)
    // number has an offset of 4 bytes (32/8).
    const lowWord = viewGetFunc.call(
      // DataView.get{Int|Uint}32
      view,
      littleEndian ? byteOffset : 4 + byteOffset,
      littleEndian
    );
    const highWord = viewGetFunc.call(
      // DataView.get{Int|Uint}32
      view,
      littleEndian ? 4 + byteOffset : byteOffset,
      littleEndian
    );
    const sign = highWord < 0;
    const signBit = sign ? 1 << 31 : 0;
    const result = new (JSBI as any)(2, sign);
    result.__setDigit(0, (lowWord >>> 0) + (sign ? 1 : 0));
    result.__setDigit(1, (highWord - (sign ? 1 : 0)) ^ signBit);
    return result;
  };
  Object.defineProperty(fn, 'name', { value: funcName });
  return fn;
}

// DataView polyfills
export const dataViewSetBigUint64 = __makeDataViewSetter(
  'DataViewSetBigUint64',
  'Uint32'
);
export const dataViewSetBigInt64 = __makeDataViewSetter(
  'DataViewSetBigInt64',
  'Int32'
);

export const dataViewGetBigUint64 = __makeDataViewGetter(
  'DataViewGetBigInt64',
  'Uint32'
);
export const dataViewGetBigInt64 = __makeDataViewGetter(
  'DataViewGetBigInt64',
  'Int32'
);

export function BigInt(arg: number, base?, endian?): BN {
  return new BN(arg, base, endian);
}

export function bigintToByteArray(bn: BN): Uint8Array {
  return bn.toArrayLike(Uint8Array, 'le', 8);
}

export function readInt64(buff, offset) {
  const buff1 = buff.readUInt32LE(offset);
  const buff2 = buff.readUInt32LE(offset + 4);
  if (!(buff2 & 0x80000000)) { return buff1 + 0x100000000 * buff2; }
  return -((~buff2 >>> 0) * 0x100000000 + (~buff1 >>> 0) + 1);
}
