import { TranslateService } from '@ngx-translate/core';
import {
  toBase64Url,
  base64ToByteArray,
  fromBase64Url,
} from './converters';

// getAddressFromPublicKey Get the formatted address from a raw public key
export function getAddressFromPublicKey(publicKey: Uint8Array): string {
  const checksum = getChecksumByte(publicKey);
  let binary = '';
  const bytes = new Uint8Array(33);
  bytes.set(publicKey, 0);
  bytes.set([checksum[0]], 32);

  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const address = toBase64Url(window.btoa(binary));

  return address;
}

export function getTranslation(
  value: string,
  translateService: TranslateService,
  // tslint:disable-next-line:ban-types
  interpolateParams?: Object
) {
  let message: string;
  translateService.get(value, interpolateParams).subscribe(res => {
    message = res;
  });
  return message;
}

export function sanitizeString(str) {
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, '');
  return str.trim();
}

export function getChecksumByte(bytes): any {
  const n = bytes.length;
  let a = 0;
  for (let i = 0; i < n; i++) {
    a += bytes[i];
  }
  const res = new Uint8Array([a]);
  return res;
}

export function stringToBuffer(str: string) {
  return Buffer.from(str, 'base64');
}

export function base64ToHex(str) {
  const raw = atob(str);
  let result = '';
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += hex.length === 2 ? hex : '0' + hex;
  }
  return result.toUpperCase();
}

export function dateAgo(value: any): any {
  if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 29) { // less than 30 seconds ago will show as 'Just now'
          return 'Just now';
      }
      const intervals = {
          year: 31536000,
          month: 2592000,
          week: 604800,
          day: 86400,
          hour: 3600,
          minute: 60,
          second: 1
      };
      let counter: string | number;
      // tslint:disable-next-line:forin
      for (const i in intervals) {
          counter = Math.floor(seconds / intervals[i]);
          if (counter > 0) {
              if (counter === 1) {
                  return counter + ' ' + i + ' ago'; // singular (1 day ago)
              } else {
                  return counter + ' ' + i + 's ago'; // plural (2 days ago)
              }
          }
      }
  }
  return value;
}

export function onCopyText(text: string) {
  const selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.opacity = '0';
  selBox.value = text;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
}

export function addressValidation(address: string) {
  const addressBase64 = fromBase64Url(address);
  const addressBytes = base64ToByteArray(addressBase64);
  if (addressBytes.length === 33 && addressBase64.length === 44) {
    return true;
  } else { return false; }
}

export function isPubKeyValid(pubkey: string) {
  const addressBytes = base64ToByteArray(pubkey);
  if (addressBytes.length === 32 && pubkey.length === 44) {
    return true;
  } else { return false; }
}

export function truncate(num: number, places: number): number {
  return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
}

export function calculateMinFee(timeout: number) {
  const blockPeriod = 10 * 1e8;
  const feePerBlockPeriod = 0.01 * 1e8;
  if (timeout) {
    return (
      (Math.ceil((timeout * 1e8) / blockPeriod) * feePerBlockPeriod) / 1e8
    );
  } else { return feePerBlockPeriod / 1e8; }
}

export function jsonBufferToString(buf: any) {
  if (!buf) { return ''; }
  try {
    return Buffer.from(buf.data, 'base64').toString('base64');
  } catch (error) {
    return buf.toString('base64');
  }
}


