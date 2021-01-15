// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import * as BN from 'bn.js';

const base58 = require('base58-encode');

declare const Buffer;


export function int32ToBytes(nmbr: number): Buffer {
  const byte = new Buffer(4);
  byte.writeUInt32LE(nmbr, 0);
  return byte;
}

export function makeShortAddress(addrs: string) {
  return addrs.concat('...').concat(addrs.substring(addrs.length - 8, addrs.length));
}

export function getFormatedDate(unixTimestamp: number) {
  const a = new Date(unixTimestamp * 1000);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min ;
  return time;
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

export function byteArrayToHex(
  bytes: ArrayBuffer | ArrayBufferView | Array<number>
): string {
  const byteArray =
    bytes instanceof ArrayBuffer
      ? new Uint8Array(bytes)
      : ArrayBuffer.isView(bytes)
      ? new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength)
      : Uint8Array.from(bytes);
  return Array.prototype.map
    .call(byteArray, byte => byte.toString(16).padStart(2, '0'))
    .join('');
}



/*
 * See: https://developers.google.com/web/updates/2014/08/Easier-ArrayBuffer-String-conversion-with-the-Encoding-API
 */
export function stringToByteArray(str: string): any {
  let bytes = [];
  for (let i = 0; i < str.length; ++i) {
    const code = str.charCodeAt(i);
    bytes = bytes.concat([code]);
  }
  return bytes;
}


export function byteArrayToString(
  bytes: ArrayBuffer | ArrayBufferView | Array<number>
): string {
  const byteArray =
    bytes instanceof ArrayBuffer
      ? bytes
      : ArrayBuffer.isView(bytes)
      ? bytes
      : Uint8Array.from(bytes);
  const decoder = new TextDecoder();
  return decoder.decode(byteArray);
}

export function base64ToByteArray(base64Str: string): Buffer {
  const buf = new Buffer(base64Str, 'base64');
  return new Buffer(buf.buffer, buf.byteOffset, buf.byteLength);
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
  return base58(bytes);
}


export function base64UrlToBuffer(base64Url: string): Buffer {
  return base64ToByteArray(fromBase64Url(base64Url));
}

export function toBase64Url(base64Str: string): string {
  return base64Str
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/\=/g, '');
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
    getAddressChecksum(bytes),
  ]);
  return toBase64Url(byteArrayToBase64(addressBytes));
}

export function fromBase64Url(base64Str: string): string {
  let base64 = base64Str.replace(/\-/g, '+').replace(/\_/g, '/');
  const pad = base64.length % 4;
  if (pad) { base64 += new Array(5 - pad).join('='); }
  return base64;
}

export function addressToPublicKey(address: string): Uint8Array {
  const addressBytes = base64ToByteArray(fromBase64Url(address));
  return new Uint8Array(
    addressBytes.buffer,
    addressBytes.byteOffset,
    addressBytes.byteLength - 1
  );
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

export function intToInt64Bytes(nmbr: number, base?, endian?): Buffer {
  const bn = new BN(nmbr, base, endian);
  return bn.toArrayLike(Buffer, 'le', 8);
}

export function BigInt(arg: number, base?, endian?): BN {
  return new BN(arg, base, endian);
}


export function bigintToByteArray(bn: BN): Buffer {
  return bn.toArrayLike(Buffer, 'le', 8);
}

export function readInt64(buff, offset) {
  const buff1 = buff.readUInt32LE(offset);
  const buff2 = buff.readUInt32LE(offset + 4);
  // tslint:disable-next-line:no-bitwise
  if (!(buff2 & 0x80000000)) { return buff1 + 0x100000000 * buff2; }
  // tslint:disable-next-line:no-bitwise
  return -((~buff2 >>> 0) * 0x100000000 + (~buff1 >>> 0) + 1);
}
