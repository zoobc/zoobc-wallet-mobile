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

export function getChecksumByte(bytes): any {
  const n = bytes.length;
  let a = 0;
  for (let i = 0; i < n; i++) {
    a += bytes[i];
  }
  const res = new Uint8Array([a]);
  return res;
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
