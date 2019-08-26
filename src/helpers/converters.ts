import { default as JSBI } from 'jsbi';

export { default as JSBI } from 'jsbi';

export function hexToByteArray(hexStr : string) : Uint8Array {
  return new Uint8Array(hexStr.match(/[\da-f]{2}/gi).map(byte => parseInt(byte, 16)));
}

export function byteArrayToHex(bytes: ArrayBuffer | ArrayBufferView | Array<number>) : string {
  const byteArray = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : ArrayBuffer.isView(bytes) ? new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength) : Uint8Array.from(bytes);
  return Array.prototype.map.call(byteArray, byte => byte.toString(16).padStart(2, "0")).join('');
}

/*
 * See: https://developers.google.com/web/updates/2014/08/Easier-ArrayBuffer-String-conversion-with-the-Encoding-API
 */
export function stringToByteArray(str: string) : Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

export function byteArrayToString(bytes: ArrayBuffer | ArrayBufferView | Array<number>) : string {
  const byteArray = bytes instanceof ArrayBuffer ? bytes : ArrayBuffer.isView(bytes) ? bytes : Uint8Array.from(bytes);
  const decoder = new TextDecoder();
  return decoder.decode(byteArray);
}

export function base64ToByteArray(base64Str: string) : Uint8Array {
  const buf = new Buffer(base64Str, 'base64');
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}

export function byteArrayToBase64(bytes: ArrayBuffer | ArrayBufferView | Array<number>) : string {
  // const byteArray = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : ArrayBuffer.isView(bytes) ? new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength) : Uint8Array.from(bytes);
  // return btoa([].reduce.call(byteArray, (acc, byte) => acc + String.fromCharCode(byte), ''));
  const buf = bytes instanceof ArrayBuffer ? Buffer.from(bytes) : ArrayBuffer.isView(bytes) ? Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength) : Buffer.from(bytes);
  return buf.toString('base64');
}

export function toBase64Url(base64Str: string) : string {
  return base64Str.replace(/\+/g, '-').replace(/\//g, '_');
}

export function fromBase64Url(base64Str: string) : string {
  return base64Str.replace(/\-/g, '+').replace(/\_/g, '/');
}

export function mergeByteArrays(resultConstructor, arrays: Array<ArrayBufferView | number[]>) {
  let totalLength = arrays.reduce((acc, arr) => ((arr as ArrayBufferView).byteLength || (arr as number[]).length) + acc, 0);
  let result = new resultConstructor(totalLength);
  let offset = 0;
  for (let arr of arrays) {
      const len = (arr as ArrayBufferView).byteLength || (arr as number[]).length;
      result.set(arr, offset);
      offset += len;
  }
  return result;
}

export function publicKeyToAddress(hexOrBytes: string | ArrayBuffer | ArrayBufferView | Array<number>) : string {
  const bytes = (typeof hexOrBytes === 'string') ? hexToByteArray(hexOrBytes) : hexOrBytes instanceof ArrayBuffer ? new Uint8Array(hexOrBytes) : ArrayBuffer.isView(hexOrBytes) ? hexOrBytes : Uint8Array.from(hexOrBytes);

  const addressBytes = mergeByteArrays(Uint8Array, [bytes, getAddressChecksum(bytes)]);
  return toBase64Url(byteArrayToBase64(addressBytes));
}

export function addressToPublicKey(address: string) : Uint8Array {
  const addressBytes = base64ToByteArray(fromBase64Url(address));
  // return addressBytes.subarray(0, addressBytes.length - 1);
  return new Uint8Array(addressBytes.buffer, addressBytes.byteOffset, addressBytes.byteLength - 1);
}

export function getAddressChecksum(bytes: ArrayBuffer | ArrayBufferView | Array<number>) : Uint8Array {
  const view : DataView = bytes instanceof ArrayBuffer ? new DataView(bytes) : ArrayBuffer.isView(bytes) ? new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength) : new DataView(Uint8Array.from(bytes).buffer);
  const n = view.byteLength;
  let a = 0;
  for (let i = 0; i < n; i++) {
    a = (a + view.getUint8(i)) % 256
  }
  return Uint8Array.from([a]);
}

// DataView polyfills
function __makeDataViewSetter(funcName, viewFuncName) {
  const viewSetFunc = DataView.prototype[`set${viewFuncName}`];
  if (typeof viewSetFunc === 'undefined') {
    throw Error('Making DataView setter with invalid view function name.');
  }

   const fn = function(view, byteOffset, value, littleEndian) {
    if (value.constructor !== JSBI) {
      throw TypeError('Value needs to be JSBI');
    }
    // Set 64 bit number as two 32 bit numbers.
    // The lower/higher (depending on endianess)
    // number has an offset of 4 bytes (32/8).
    const signBit = value.sign ? (1 << 31) : 0;
    const lowWord = value.__unsignedDigit(0) - (value.sign ? 1 : 0);
    viewSetFunc.call( // DataView.set{Int|Uint}32
      view,
      littleEndian ? byteOffset : 4 + byteOffset,
      lowWord, littleEndian
    );
    const highWord = (value.__unsignedDigit(1) | signBit) + (value.sign ? 1 : 0);
    viewSetFunc.call( // DataView.set{Int|Uint}32
      view,
      littleEndian ? 4 + byteOffset : byteOffset,
      highWord, littleEndian
    );
  };
  Object.defineProperty(fn, 'name', {value: funcName});
  return fn;
}

function __makeDataViewGetter(funcName, viewFuncName) {
  const viewGetFunc = DataView.prototype[`get${viewFuncName}`];
  if (typeof viewGetFunc === 'undefined') {
    throw Error('Making DataView getter with invalid view function name.');
  }

   const fn = function(view, byteOffset, littleEndian) {
    // Get 64 bit number as two 32 bit numbers.
    // The lower/higher (depending on endianess)
    // number has an offset of 4 bytes (32/8).
    const lowWord = viewGetFunc.call( // DataView.get{Int|Uint}32
      view,
      littleEndian ? byteOffset : 4 + byteOffset,
      littleEndian
    );
    const highWord = viewGetFunc.call( // DataView.get{Int|Uint}32
      view,
      littleEndian ? 4 + byteOffset : byteOffset,
      littleEndian
    );
    const sign = highWord < 0;
    const signBit = sign ? (1 << 31) : 0;
    const result = new (JSBI as any)(2, sign);
    result.__setDigit(0, (lowWord >>> 0) + (sign ? 1 : 0));
    result.__setDigit(1, (highWord - (sign ? 1 : 0)) ^ signBit);
    return result;
  };
  Object.defineProperty(fn, 'name', {value: funcName});
  return fn;
}

// DataView polyfills
export const dataViewSetBigUint64 = __makeDataViewSetter('DataViewSetBigUint64', 'Uint32');
export const dataViewSetBigInt64 = __makeDataViewSetter('DataViewSetBigInt64', 'Int32');
export const dataViewGetBigUint64 = __makeDataViewGetter('DataViewGetBigInt64', 'Uint32');
export const dataViewGetBigInt64 = __makeDataViewGetter('DataViewGetBigInt64', 'Int32');

export function readInt64(buff, offset) {
  var buff1 = buff.readUInt32LE(offset);
  var buff2 = buff.readUInt32LE(offset + 4);
  if (!(buff2 & 0x80000000)) return buff1 + 0x100000000 * buff2;
  return -((~buff2 >>> 0) * 0x100000000 + (~buff1 >>> 0) + 1);
}