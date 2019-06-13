export function hexToArrayByte(hexStr : string) : Uint8Array {
  return new Uint8Array(hexStr.match(/[\da-f]{2}/gi).map(byte => parseInt(byte, 16)));
}

export function arrayByteToHex(bytes: ArrayBuffer | ArrayBufferView | Array<number>) : string {
  const byteArray = bytes instanceof ArrayBuffer ? bytes : ArrayBuffer.isView(bytes) ? new Uint8Array(bytes.buffer) : Uint8Array.from(bytes);
  return Array.prototype.map.call(byteArray, byte => byte.toString(16).padStart(2, "0")).join('');
}

/*
 * See: https://developers.google.com/web/updates/2014/08/Easier-ArrayBuffer-String-conversion-with-the-Encoding-API
 */
export function stringToArrayByte(str: string) : Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

export function arrayByteToString(bytes: ArrayBuffer | ArrayBufferView | Array<number>) : string {
  const byteArray = bytes instanceof ArrayBuffer ? bytes : ArrayBuffer.isView(bytes) ? bytes : Uint8Array.from(bytes);
  const decoder = new TextDecoder();
  return decoder.decode(byteArray);
}

export function base64ToArrayByte(base64Str: string) : Uint8Array {
  const buf = new Buffer(base64Str, 'base64');
  return new Uint8Array(buf.buffer);
}

export function arrayByteToBase64(bytes: ArrayBuffer | ArrayBufferView | Array<number>) : string {
  // const byteArray = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : ArrayBuffer.isView(bytes) ? new Uint8Array(bytes.buffer) : Uint8Array.from(bytes);
  // return btoa([].reduce.call(byteArray, (acc, byte) => acc + String.fromCharCode(byte), ''));
  const arrayBuf : ArrayBufferLike = bytes instanceof ArrayBuffer ? bytes : ArrayBuffer.isView(bytes) ? bytes.buffer : Uint8Array.from(bytes).buffer;
  const buf = Buffer.from(arrayBuf);
  return buf.toString('base64');
}

export function mergeTypedArrays(resultConstructor, arrays: Array<ArrayBufferView | number[]>) {
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
  const bytes = (typeof hexOrBytes === 'string') ? hexToArrayByte(hexOrBytes) : hexOrBytes instanceof ArrayBuffer ? new Uint8Array(hexOrBytes) : ArrayBuffer.isView(hexOrBytes) ? hexOrBytes : Uint8Array.from(hexOrBytes);

  const addressBytes = mergeTypedArrays(Uint8Array, [bytes, getAddressChecksum(bytes)]);
  return arrayByteToBase64(addressBytes);
}

export function getAddressChecksum(bytes: ArrayBuffer | SharedArrayBuffer | ArrayBufferView) : Uint8Array {
  const view = new DataView(ArrayBuffer.isView(bytes) ? bytes.buffer : bytes);
  const n = view.byteLength;
  let a = 0;
  for (let i = 0; i < n; i++) {
    a = (a + view.getUint8(i)) % 256
  }
  return Uint8Array.from([a]);
}
